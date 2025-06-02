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
        searchContent.style.display = 'block';
        newContent.style.display = 'none';
    });

    try {
        const [clientRows, taskRows] = await Promise.all([
            getClientsAsync(),
            getTasksAsync()
        ]);

        const clients = clientRows.map(r => r.name);
        const tasks = taskRows.map(r => r.name);

        populateClientDropdown(document.getElementById('client'), clients);
        populateTaskDropdown(document.getElementById('task'), tasks);

        getEntries((err, entries) => {
            if (err) return console.error(err);
            entries.forEach(row => {
                createClientCard(row, clients, tasks);
            });
        });

        document.getElementById('addTaskBtn').addEventListener('click', () => {
            const container = document.getElementById('tasksContainer');

            const html = `
                 <div class="taskGroup">
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

            // After inserting, populate the newly added select with task options
            const newTaskSelect = container.lastElementChild.querySelector('select[name="task"]');
            populateTaskOptions(newTaskSelect, rows);
        })

    } catch (err) {
        console.error('Failed to load clients or tasks:', err);
    }

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

        // Gather all task data into an array
        const tasksData = Array.from(taskGroups).map(group => {
            return {
                task: group.querySelector('select[name="task"]').value,
                hours: group.querySelector('input[name="hours"]').value,
                quantity: group.querySelector('input[name="quantity"]').value,
                description: group.querySelector('textarea[name="description"]').value,
            };
        });

        // Insert tasks sequentially (or in parallel with Promise.all)
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
                // Optionally reset the form here
                document.getElementById('entryForm').reset();
                // Optionally clear all tasks except the first one, etc.
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



function createClientCard(row, clients, taskTypes) {
    const clientDiv = document.createElement("div");
    clientDiv.className = "client-entry";

    const clientSelect = document.createElement("select");
    clients.forEach(client => {
        const option = document.createElement("option");
        option.value = option.textContent = client;
        if (client === row.client) option.selected = true;
        clientSelect.appendChild(option);
    });
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = row.date;

    const descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.value = row.description;
    descriptionInput.placeholder = "Description";

    const taskTypeSelect = document.createElement("select");
    taskTypes.forEach(task => {
        const option = document.createElement("option");
        option.value = option.textContent = task;
        if (task === row.taskType) option.selected = true;
        taskTypeSelect.appendChild(option);
    });

    const hoursInput = document.createElement("input");
    hoursInput.type = "number";
    hoursInput.value = row.hours;
    hoursInput.placeholder = "Hours";

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = row.quantity;
    quantityInput.placeholder = "Quantity";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => {
        clientDiv.remove();
    };

    clientDiv.appendChild(clientSelect);
    clientDiv.appendChild(dateInput);
    clientDiv.appendChild(descriptionInput);
    clientDiv.appendChild(taskTypeSelect);
    clientDiv.appendChild(hoursInput);
    clientDiv.appendChild(quantityInput);
    clientDiv.appendChild(deleteButton);

    document.getElementById("searchResults").appendChild(clientDiv);
}
