// database.js

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'test.db');

const db = openDatabase();

function openDatabase() {
    return new sqlite3.Database(dbPath);
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
    createClientsTable,
    createHourlyRateTable,
    initHourlyRateTable,
    getHourlyRate,
    updateHourlyRate,
    updateClient,
    insertClient,
    deleteClient,
    getClients,
    getDeletedClients,
    close,
    restoreClient
};

function close() {
    db.close();
}