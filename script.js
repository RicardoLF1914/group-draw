const form = document.querySelector("#form");
const nameInput = document.querySelector("#name");
const list = document.querySelector("#list");
const count = document.querySelector("#count");
const groupsCountInput = document.getElementById("groups-count");
const maxMembersInput = document.getElementById("max-members");
const drawButton = document.getElementById("draw-button");
const message = document.getElementById("message");

const leaderModeInputs = document.querySelectorAll('input[name="leader-mode"]');

let people = [];
let nextId = 1;

function getLeaderMode() {
    return document.querySelector('input[name="leader-mode"]:checked').value;
}

function nameExists(name) {
    return people.some(
        (person) => person.name.toLowerCase() === name.toLowerCase()
    );
}

function addPerson(name) {
    people.push({ id: nextId++, name, isLeader: false });
}

function removePerson(id) {
    people = people.filter((person) => person.id !== id);
}

function toggleLeader(id) {
    const person = people.find((person) => person.id === id);
    if (person) {
        person.isLeader = !person.isLeader;
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

function renderCount() {
    const total = people.length;
    const label = total === 1 ? "pessoa cadastrada" : "pessoas cadastradas";
    count.textContent = `${total} ${label}`;
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
    input.addEventListener("change", renderList);
});

drawButton.addEventListener("click", () => {
    message.textContent = "";

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

    console.log(result.groups);
});

render();