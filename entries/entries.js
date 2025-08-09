const { getClients, getTasks, insertEntry, getEntries, updateEntry}  = require('../database');


var clients
var tasks
document.addEventListener('DOMContentLoaded', async () => {

	const newBtn = document.getElementById('newBtn');
	const searchBtn = document.getElementById('searchBtn');
	const newContent = document.getElementById('newContent');
	const searchContent = document.getElementById('searchContent');

	searchContent.style.display = 'none';

	newBtn.addEventListener('click', () => {
		newContent.style.display = 'block';
		searchContent.style.display = 'none';
	});

	searchBtn.addEventListener('click', () => {
		searchContent.style.display = 'flex';
		newContent.style.display = 'none';
	});

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

	document.getElementById("searchBar").addEventListener("change", async (event) => {
		

	const client = document.getElementById("searchClient").value;
	const startDate = document.getElementById("searchStartDate").value;
	const endDate = document.getElementById("searchEndDate").value;
	const div = document.getElementById("searchResults");
		div.innerHTML = "";

		var entries

		try {
			const [entryRows] = await Promise.all([
				getEntriesAsync(client, startDate, endDate)
			]);
			entries = entryRows
		} catch (err) {
			console.error('Failed to load entries:', err);
		}

		entries.forEach((entry) => createEntryCard(entry, clients, tasks))
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

function getEntriesAsync(client, startDate, endDate) {
	return new Promise((resolve, reject) => {
		getEntries((err, rows) => {
			if (err) reject(err)
			else resolve(rows)
		}, client, startDate, endDate);
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

	const dateInput = {row: row, header: "Date", value: row.date, parentContainer: taskDiv }

	dateInput.editModeDiv = document.createElement('input');
	dateInput.editModeDiv.type = "date"
	 
	editableDate = insertEditableComponent(dateInput)
	taskSelectables.appendChild(editableDate)
	
	const clientInput = {row: row, header: "Client", value: row.client_name, parentContainer: taskDiv, options: clients}
	clientInput.editModeDiv = document.createElement("select")
	
	editableClient = insertEditableComponent(clientInput)
	taskSelectables.appendChild(editableClient)

	const taskInput = {row: row, header: "Task", value: row.task_name, parentContainer: taskDiv, options: taskTypes} 
	
	taskInput.editModeDiv = document.createElement("select")

	editableTask = insertEditableComponent(taskInput)
	taskSelectables.appendChild(editableTask)
	

	const hoursInput = {row: row, header: "Hours", value: row.hours, parentContainer: taskDiv} 
	hoursInput.editModeDiv = document.createElement('input');
	hoursInput.editModeDiv.type = 'number';
	hoursInput.editModeDiv.step = '1';
	hoursInput.editModeDiv.min = '0';

	editableHours = insertEditableComponent(hoursInput)
	taskSelectables.appendChild(editableHours)

	
	const quantityInput = {row: row, header: "Quantity", value: row.quantity, parentContainer: taskDiv}
	quantityInput.editModeDiv = document.createElement('input');
	quantityInput.editModeDiv.type = 'number';
	quantityInput.editModeDiv.step = '1';
	quantityInput.editModeDiv.min = '0';

	editableQuantity = insertEditableComponent(quantityInput)
	taskSelectables.appendChild(editableQuantity)



	const taskDescription = document.createElement("div")

	const descriptionInput = {row: row, header: "Description", value: row.description, parentContainer: taskDiv}
	
	descriptionInput.editModeDiv = document.createElement("textarea")

	
	editableDescription = insertEditableComponent(descriptionInput)

	taskDescription.appendChild(editableDescription)

	taskDiv.appendChild(taskSelectables)
	taskDiv.appendChild(taskDescription)
	
	document.getElementById("searchResults").appendChild(taskDiv);
}


function updateEntryRow(args, regularModeDiv) {
	args.editModeDiv.style.display = "none"
	regularModeDiv.style.display = "block";
	if (args.editModeDiv.value !== "") {
		regularModeDiv.textContent = args.editModeDiv.value;
		switch(args.header) {
			case "Quantity":
				args.row.quantity = args.editModeDiv.value;
				break;
			default:
				console.error("this should never happen")
		}
		updateEntry(args.row, (err) => {if(err){console.error(err)}})
	}
}


function insertEditableComponent(args) {
	const container = document.createElement("div")
	container.className = "taskInputContainer"

	const headerDiv = document.createElement("div")
	headerDiv.textContent = args.header
	headerDiv.className = "editableHeader"

	container.appendChild(headerDiv)

	const contentDiv = document.createElement("div")

	const regularModeDiv = document.createElement("div");
	regularModeDiv.textContent = args.value;
	regularModeDiv.style.display = "block";
	regularModeDiv.className = "editableContent"

	args.editModeDiv.style.display = "none";
	if (args.options !== undefined) {
		args.options.forEach(option => {
			const o = document.createElement("option");
			o.value = o.textContent = option;
			args.editModeDiv.appendChild(o);
		});
	}
	args.editModeDiv.value = args.value;

	contentDiv.appendChild(regularModeDiv)
	contentDiv.appendChild(args.editModeDiv)

	container.append(contentDiv)

	args.editModeDiv.addEventListener("change", (event) => {
			updateEntryRow(args, regularModeDiv);
	});

	regularModeDiv.addEventListener("click", () => {
		args.editModeDiv.style.display = "block"
		regularModeDiv.style.display = "none";
		args.editModeDiv.value = regularModeDiv.textContent
		args.editModeDiv.focus();
	})

	args.editModeDiv.addEventListener("keydown", (event) => {
		if(event.key === "Enter"){
			updateEntryRow(args, regularModeDiv);
		}
		if (event.key === "Escape") {
			args.editModeDiv.style.display = "none"
			regularModeDiv.style.display = "block";
		}
	});

	args.editModeDiv.addEventListener("change", () => {
		args.editModeDiv.style.display = "none";
		regularModeDiv.style.display = "block";
		regularModeDiv.textContent = args.editModeDiv.value;
	});

	return container
}
