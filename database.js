// database.js

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'test.db');

const db = openDatabase();

function openDatabase() {
    return new sqlite3.Database(dbPath);
}

//entries
function createEntriesTable(callback) {
    const sql = `
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name TEXT,
            task_name TEXT,
            date TEXT,
            hours REAL,
            quantity INTEGER,
            description TEXT,
            FOREIGN KEY(client_name) REFERENCES clients(name) ON UPDATE CASCADE,
            FOREIGN KEY(task_name) REFERENCES tasks(name) ON UPDATE CASCADE
        )
    `;
    db.run("PRAGMA foreign_keys = ON");
    db.run(sql, [], callback);
}

function insertEntry(client, task, date, hours, quantity, description, callback) {
    db.run('INSERT INTO entries (client_name, task_name, date, hours, quantity, description) VALUES (?, ?, ?, ?, ?, ?)', [client, task, date, hours, quantity, description], callback);
}

function getEntries(callback, client, startDate, endDate) {


    var queryString = 'SELECT * FROM entries'

    var queryArgs = []
    


    var queryStringExtension = [];
    if (client) {
        queryStringExtension.push('client_name = ?') 
	queryArgs.push(client);
    } 


    if (startDate) {
        queryStringExtension.push('date >= ?');
	queryArgs.push(startDate)
    }

    if (endDate) {

        queryStringExtension.push('date <= ?');
	queryArgs.push(endDate)
    }


    for(let i = 0; i < queryStringExtension.length; i++){
       if(i == 0) {
	    queryString += ' WHERE '
	
	}else {
	    queryString += ' AND '
	}
	queryString += queryStringExtension[i]; 
    }
    db.all(queryString, queryArgs, callback)
}

//clients
function createClientsTable(callback) {
    db.run('CREATE TABLE IF NOT EXISTS clients (name TEXT PRIMARY KEY, active BOOLEAN DEFAULT 1)', [], callback);
}

function insertClient(name, callback) {
    db.run('INSERT INTO clients (name) VALUES (?)', [name], callback);
}

function deleteClient(name, callback) {
    db.run('UPDATE clients SET active = 0 WHERE name = ?', [name], callback);
}

function getClients(callback) {
    db.all('SELECT name FROM clients WHERE active = 1 ORDER BY LOWER(name)', [], callback);
}

function getDeletedClients(callback) {
    db.all('SELECT name FROM clients WHERE active = 0 ORDER BY LOWER(name)', [], callback);
}

function updateClient(oldName, newName, callback) {
    db.run('UPDATE clients SET name = ? WHERE name = ?', [newName, oldName], callback);
}

function restoreClient(name, callback) {
    db.run('UPDATE clients SET active = 1 WHERE name = ?', [name], callback);
}

//tasks
function createTasksTable(callback) {
    db.run('CREATE TABLE IF NOT EXISTS tasks (name TEXT PRIMARY KEY, active BOOLEAN DEFAULT 1)', [], callback);
}

function insertTask(name, callback) {
    db.run('INSERT INTO tasks (name) VALUES (?)', [name], callback);
}

function deleteTask(name, callback) {
    db.run('UPDATE tasks SET active = 0 WHERE name = ?', [name], callback);
}

function getTasks(callback) {
    db.all('SELECT name FROM tasks WHERE active = 1 ORDER BY LOWER(name)', [], callback);
}

function getDeletedTasks(callback) {
    db.all('SELECT name FROM tasks WHERE active = 0 ORDER BY LOWER(name)', [], callback);
}

function updateTask(oldName, newName, callback) {
    db.run('UPDATE tasks SET name = ? WHERE name = ?', [newName, oldName], callback);
}

function restoreTask(name, callback) {
    db.run('UPDATE tasks SET active = 1 WHERE name = ?', [name], callback);
}

//hourlyRate
function createHourlyRateTable(callback) {
    db.run('CREATE TABLE IF NOT EXISTS hourlyRate (id TEXT PRIMARY KEY, rate INTEGER)', callback);
}

function initHourlyRateTable(callback) {
    db.run('INSERT OR IGNORE INTO hourlyRate (id, rate) VALUES (?, ?)', ['current', 30], callback);
}

function getHourlyRate(callback) {
    db.all('SELECT rate FROM hourlyRate WHERE id = ?', ['current'], callback);
}

function updateHourlyRate(newRate, callback) {
    db.run('UPDATE hourlyRate SET rate = ? WHERE id = ?', [newRate, 'current'], callback);
}

module.exports = {
    openDatabase,
    close,
    createClientsTable,
    updateClient,
    insertClient,
    deleteClient,
    getClients,
    getDeletedClients,
    restoreClient,
    createTasksTable,
    updateTask,
    insertTask,
    deleteTask,
    getTasks,
    getDeletedTasks,
    restoreTask,
    createHourlyRateTable,
    initHourlyRateTable,
    getHourlyRate,
    updateHourlyRate,
    createEntriesTable,
    insertEntry,
    getEntries
};

function close() {
    db.close();
}
