const { getClients, getTasks, insertEntry, getEntries } = require('../database');

document.addEventListener('DOMContentLoaded', async () => {

    const newBtn = document.getElementById('newBtn');
    const searchBtn = document.getElementById('searchBtn');
    const newContent = document.getElementById('newContent');
    const searchContent = document.getElementById('searchContent');

    newBtn.addEventListener('click', () => {
        newContent.style.display = 'block';
        searchContent.style.display = 'none';
    });

    searchBtn.addEventListener('click', () => {
        searchContent.style.display = 'flex';
        newContent.style.display = 'none';
    });

    var clients
    var tasks
    var entries
    try {
        const [clientRows, taskRows, entryRows] = await Promise.all([
            getClientsAsync(),
            getTasksAsync(),
            getEntriesAsync()
        ]);

        clients = clientRows.map(r => r.name);
        tasks = taskRows.map(r => r.name);
        entries = entryRows
    } catch (err) {
        console.error('Failed to load clients or tasks:', err);
    }

    populateClientDropdown(document.getElementById('client'), clients);
    populateClientDropdown(document.getElementById('searchClient'), clients);
    populateTaskDropdown(document.getElementById('task'), tasks);

    entries.forEach((entry) => createEntryCard(entry, clients, tasks))

    document.getElementById('addTaskBtn').addEventListener('click', () => {
        const container = document.getElementById('tasksContainer');

        const html = `
                 <div class="taskGroup secondary">
                    <label>Task:</label>
                    <button class="removeTask" type="button">Remove</button>
                    <div id="taskForm">
                        <select id="task" name="task" required>
                            <option value="">Select a task</option>
                        </select>
                        <input type="number" name="hours" step="1" min="0" placeholder="Hours">
                        <input type="number" name="quantity" step="1" min="0" placeholder="Quantity">
                    </div>
                    <div class="task-description-container">
                        <textarea name="description" placeholder="Description" required></textarea>
                    </div>
                </div>`;

        container.insertAdjacentHTML('beforeend', html);

        const newTaskSelect = container.lastElementChild.querySelector('select[name="task"]');
        populateTaskDropdown(newTaskSelect, tasks);
    })

    document.getElementById("tasksContainer").addEventListener('click', (event) => {
        if (event.target.classList.contains('removeTask')) {
            event.target.closest('.taskGroup').remove();
        }
    });

    document.getElementById('entryForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const client = document.getElementById('client').value;
        const date = document.getElementById('date').value;
        const taskGroups = document.querySelectorAll('.taskGroup');

        const tasksData = Array.from(taskGroups).map(group => {
            return {
                task: group.querySelector('select[name="task"]').value,
                hours: group.querySelector('input[name="hours"]').value,
                quantity: group.querySelector('input[name="quantity"]').value,
                description: group.querySelector('textarea[name="description"]').value,
            };
        });

        const insertPromises = tasksData.map(t => {
            return new Promise((resolve, reject) => {
                insertEntry(client, t.task, date, t.hours || 0, t.quantity || 0, t.description, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });

        Promise.all(insertPromises)
            .then(() => {
                alert('All tasks inserted successfully!');
                document.getElementById('entryForm').reset();
                document.querySelectorAll('div.remove-me').forEach(el => el.remove());
            })
            .catch(err => {
                console.error('Error inserting tasks:', err);
                alert('There was an error inserting your tasks.');
            });
    });
});

function getClientsAsync() {
    return new Promise((resolve, reject) => {
        getClients((err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function getTasksAsync() {
    return new Promise((resolve, reject) => {
        getTasks((err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function getEntriesAsync() {
    return new Promise((resolve, reject) => {
        getEntries((err, rows) => {
            if (err) reject(err)
            else resolve(rows)
        });
    })
}

function populateClientDropdown(select, clients) {
    clients.forEach(name => {
        const option = document.createElement('option');
        option.value = option.textContent = name;
        select.appendChild(option);
    });
}

function populateTaskDropdown(select, tasks) {
    tasks.forEach(name => {
        const option = document.createElement('option');
        option.value = option.textContent = name;
        select.appendChild(option);
    });
}


function createEntryCard(row, clients, taskTypes) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-entry";

    const taskSelectables = document.createElement("div")
    taskSelectables.className = "task-selectables"

    const dateInput = document.createElement('input');
    dateInput.type = "date"

    editableDate = insertEditableComponent("Date", dateInput, "nothing")
    taskSelectables.appendChild(editableDate)

    const clientInput = document.createElement("select")

    editableClient = insertEditableComponent("Client", clientInput, "baz", clients)
    taskSelectables.appendChild(editableClient)

    const taskInput = document.createElement("select")

    editableTask = insertEditableComponent("Task", taskInput, "baz", taskTypes)
    taskSelectables.appendChild(editableTask)

    const hoursInput = document.createElement('input');
    hoursInput.type = 'number';
    hoursInput.step = '1';
    hoursInput.min = '0';

    editableHours = insertEditableComponent("Hours", hoursInput, 0)
    taskSelectables.appendChild(editableHours)

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.step = '1';
    quantityInput.min = '0';

    editableQuantity = insertEditableComponent("Quantity", quantityInput, 0)
    taskSelectables.appendChild(editableQuantity)


    taskDiv.appendChild(taskSelectables)

    const taskDescription = document.createElement("div")

    const descriptionInput = document.createElement("textarea")

    editableDescription = insertEditableComponent("Description", descriptionInput, "placeholder text")

    taskDescription.appendChild(editableDescription)

    taskDiv.appendChild(taskDescription)

    document.getElementById("searchResults").appendChild(taskDiv);
}

function insertEditableComponent(header, editModeDiv, content, options) {

    const container = document.createElement("div")
    container.className = "taskInputContainer"

    const headerDiv = document.createElement("div")
    headerDiv.textContent = header
    headerDiv.className = "editableHeader"

    container.appendChild(headerDiv)

    const contentDiv = document.createElement("div")

    const regularModeDiv = document.createElement("div");
    regularModeDiv.textContent = content;

    regularModeDiv.className = "editableContent"

    editModeDiv.display = "none";

    if (options !== undefined) {
        options.forEach(option => {
            const o = document.createElement("option");
            o.value = o.textContent = option;
            editModeDiv.appendChild(o);
        });
    }

    contentDiv.appendChild(regularModeDiv)
    contentDiv.appendChild(editModeDiv)

    container.append(contentDiv)

    document.addEventListener("click", (event) => {
        if (!editModeDiv.contains(event.target) && !regularModeDiv.contains(event.target)) {
            editModeDiv.style.display = "none"
            regularModeDiv.style.display = "block";
            if (editModeDiv.value !== "") {
                regularModeDiv.textContent = editModeDiv.value;
            }
        }
    });

    regularModeDiv.addEventListener("click", () => {
        editModeDiv.style.display = "block"
        regularModeDiv.style.display = "none";
        editModeDiv.value = regularModeDiv.textContent
    })

    editModeDiv.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && event.target.value !== "") {
            editModeDiv.style.display = "none"
            regularModeDiv.style.display = "block";
            regularModeDiv.textContent = event.target.value;
        }

        if (event.key === "Escape") {
            editModeDiv.style.display = "none"
            regularModeDiv.style.display = "block";
        }
    });

    return container
}
