document.addEventListener('DOMContentLoaded', () => {
    const { getClients, getTasks } = require('../database');

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

    const taskSelect = document.getElementById('task');

    function populateTaskOptions(selectElem, tasks) {
        tasks.forEach(row => {
            const option = document.createElement('option');
            option.value = row.name;
            option.textContent = row.name;
            selectElem.appendChild(option);
        });
    }

    getTasks((err, rows) => {
        if (err) {
            console.error('Error fetching clients:', err);
            return;
        }
        populateTaskOptions(taskSelect, rows);

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
        });
    });

    document.getElementById("tasksContainer").addEventListener('click', (event) => {
        if (event.target.classList.contains('removeTask')) {
            event.target.closest('.taskGroup').remove();
        }
    });

    const clientSelect = document.getElementById('client');

    getClients((err, rows) => {
        if (err) {
            console.error('Error fetching clients:', err);
            return;
        }
        rows.forEach(row => {
            const option = document.createElement('option');
            option.value = row.name;
            option.textContent = row.name;
            clientSelect.appendChild(option);
        });
    });

});