const form = document.querySelector("#form");
const nameInput = document.querySelector("#name");
const list = document.querySelector("#list");
const count = document.querySelector("#count");

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

render();