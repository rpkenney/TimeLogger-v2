// database.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'test.db');

function openDatabase() {
    return new sqlite3.Database(dbPath);
}

function createClientsTable(db, callback) {
    db.run('CREATE TABLE IF NOT EXISTS clients (name TEXT PRIMARY KEY)', [], callback);
}

function insertClient(db, name, callback) {
    db.run('INSERT INTO clients (name) VALUES (?)', [name], callback);
}

function getClients(db, callback) {
    db.all('SELECT name FROM clients', [], callback);
}

module.exports = {
    openDatabase,
    createClientsTable,
    insertClient,
    getClients
};
