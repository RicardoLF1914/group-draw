const form = document.querySelector("#form");
const nameInput = document.querySelector("#name");
const list = document.querySelector("#list");
const count = document.querySelector("#count");
const groupsCountInput = document.querySelector("#groups-count");
const maxMembersInput = document.querySelector("#max-members");
const drawButton = document.querySelector("#draw-button");
const message = document.querySelector("#message");
const results = document.querySelector("#results");
const clearButton = document.querySelector("#clear-button");
const copyButton = document.querySelector("#copy-button");

const leaderModeInputs = document.querySelectorAll('input[name="leader-mode"]');

let people = [];
let lastGroups = [];
let nextId = 1;

const STORAGE_KEY = "group-draw-state";

function saveState() {
    const state = {
        people,
        groupsCount: groupsCountInput.value,
        maxMembers: maxMembersInput.value,
        leaderMode: getLeaderMode()
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn("Could not save state:", error);
    }
}

function isValidPerson(person) {
    return (
        person !== null &&
        typeof person === "object" &&
        Number.isInteger(person.id) &&
        typeof person.name === "string" &&
        typeof person.isLeader === "boolean"
    );
}

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            return;
        }

        const state = JSON.parse(saved);

        if (Array.isArray(state.people)) {
            people = state.people.filter(isValidPerson);
            nextId = Math.max(0, ...people.map((person) => person.id)) + 1;
        }

        if (state.groupsCount !== undefined) {
            groupsCountInput.value = state.groupsCount;
        }

        if (state.maxMembers !== undefined) {
            maxMembersInput.value = state.maxMembers;
        }

        const modeInput = document.querySelector(
            `input[name="leader-mode"][value="${state.leaderMode}"]`
        );
        if (modeInput) {
            modeInput.checked = true;
        }
    } catch (error) {
        console.warn("Could not load state:", error);
    }
}

function getLeaderMode() {
    return document.querySelector('input[name="leader-mode"]:checked').value;
}

function nameExists(name) {
    return people.some(
        (person) => person.name.toLowerCase() === name.toLowerCase()
    );
}

function clearResults() {
    lastGroups = [];
    results.innerHTML = "";
    message.textContent = "";
    copyButton.hidden = true;
}

function handleChange() {
    saveState();
    clearResults();
}

function addPerson(name) {
    people.push({ id: nextId++, name, isLeader: false });
    handleChange();
}

function removePerson(id) {
    people = people.filter((person) => person.id !== id);
    handleChange();
}

function toggleLeader(id) {
    const person = people.find((person) => person.id === id);
    if (person) {
        person.isLeader = !person.isLeader;
        handleChange();
    }
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function readMaxMembers() {
    const value = maxMembersInput.value.trim();
    return value === "" ? null : Number(value);
}

function drawGroups(people, groupsCount, maxMembers, leaderMode) {
    if (!Number.isInteger(groupsCount) || groupsCount < 1) {
        return { error: "Informe um número de grupos válido." };
    }

    if (maxMembers !== null && (!Number.isInteger(maxMembers) || maxMembers < 1)) {
        return { error: "Informe um máximo de membros válido ou deixe o campo vazio." };
    }

    if (people.length < groupsCount) {
        return { error: "Há menos pessoas cadastradas do que grupos." };
    }

    if (maxMembers !== null && people.length > groupsCount * maxMembers) {
        return {
            error: `${people.length} pessoas não cabem em ${groupsCount} grupos com no máximo ${maxMembers} membros cada.`
        };
    }

    let leaders = [];

    if (leaderMode === "manual") {
        leaders = people.filter((person) => person.isLeader);
        if (leaders.length !== groupsCount) {
            return {
                error: `Marque exatamente ${groupsCount} líder(es), um por grupo. Marcados até agora: ${leaders.length}.`
            };
        }
        leaders = shuffle(leaders);
    } else if (leaderMode === "random") {
        leaders = shuffle(people).slice(0, groupsCount);
    }

    const leaderIds = new Set(leaders.map((leader) => leader.id));
    const rest = shuffle(people.filter((person) => !leaderIds.has(person.id)));

    const groups = Array.from({ length: groupsCount }, (_, index) => {
        const leader = leaders[index] ?? null;
        return { leader, members: leader ? [leader] : [] };
    });

    rest.forEach((person, index) => {
        groups[index % groupsCount].members.push(person);
    });

    return { groups };
}

function renderResults(groups) {
    results.innerHTML = "";

    groups.forEach((group, index) => {
        const card = document.createElement("article");
        card.className = "group";

        const title = document.createElement("h3");
        title.textContent = `Grupo ${index + 1}`;

        const total = document.createElement("span");
        total.textContent = group.members.length === 1
            ? "1 pessoa"
            : `${group.members.length} pessoas`;
        title.appendChild(total);

        const membersList = document.createElement("ul");

        group.members.forEach((person) => {
            const item = document.createElement("li");
            item.textContent = person.name;

            if (group.leader && person.id === group.leader.id) {
                item.classList.add("leader");

                const badge = document.createElement("span");
                badge.className = "badge";
                badge.textContent = "Líder";
                item.appendChild(badge);
            }

            membersList.appendChild(item);
        });

        card.append(title, membersList);
        results.appendChild(card);
    });
}

function formatGroupsAsText(groups) {
    return groups
        .map((group, index) => {
            const lines = group.members.map((person) => {
                const isLeader = group.leader && person.id === group.leader.id;
                return `- ${person.name}${isLeader ? " (líder)" : ""}`;
            });
            return `Grupo ${index + 1}\n${lines.join("\n")}`;
        })
        .join("\n\n");
}

function renderCount() {
    const total = people.length;
    const label = total === 1 ? "pessoa cadastrada" : "pessoas cadastradas";
    count.textContent = `${total} ${label}`;
    clearButton.hidden = total === 0;
}

function renderList() {
    list.innerHTML = "";
    const isManual = getLeaderMode() === "manual";

    people.forEach((person) => {
        const item = document.createElement("li");
        item.className = "person";
        if (isManual && person.isLeader) {
            item.classList.add("is-leader");
        }

        const personName = document.createElement("span");
        personName.className = "person-name";
        personName.textContent = person.name;

        const actions = document.createElement("div");
        actions.className = "person-actions";

        if (isManual) {
            const toggle = document.createElement("label");
            toggle.className = "leader-toggle";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = person.isLeader;
            checkbox.addEventListener("change", () => {
                toggleLeader(person.id);
                renderList();
            });

            toggle.append(checkbox, "Líder");
            actions.appendChild(toggle);
        }

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.textContent = "Remover";
        removeButton.addEventListener("click", () => {
            removePerson(person.id);
            render();
        });
        actions.appendChild(removeButton);

        item.append(personName, actions);
        list.appendChild(item);
    });
}

function render() {
    renderList();
    renderCount();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    if (!name) {
        return;
    }

    if (nameExists(name)) {
        nameInput.setCustomValidity("Esse nome já foi cadastrado.");
        nameInput.reportValidity();
        return;
    }

    addPerson(name);
    nameInput.value = "";
    nameInput.focus();
    render();
});

nameInput.addEventListener("input", () => {
    nameInput.setCustomValidity("");
});

leaderModeInputs.forEach((input) => {
    input.addEventListener("change", () => {
        renderList();
        handleChange();
    });
});

groupsCountInput.addEventListener("input", handleChange);
maxMembersInput.addEventListener("input", handleChange);

drawButton.addEventListener("click", () => {
    clearResults();

    const result = drawGroups(
        people,
        Number(groupsCountInput.value),
        readMaxMembers(),
        getLeaderMode()
    );

    if (result.error) {
        message.textContent = result.error;
        return;
    }

    lastGroups = result.groups;
    renderResults(lastGroups);
    copyButton.hidden = false;
});

clearButton.addEventListener("click", () => {
    if (!confirm("Remover todas as pessoas da lista?")) {
        return;
    }

    people = [];
    nextId = 1;
    handleChange();
    render();
});

copyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(formatGroupsAsText(lastGroups));
        copyButton.textContent = "Copiado!";
    } catch (error) {
        copyButton.textContent = "Não foi possível copiar";
    }

    setTimeout(() => {
        copyButton.textContent = "Copiar resultado";
    }, 2000);
});

loadState();
render();