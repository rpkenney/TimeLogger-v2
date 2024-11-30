const sqlite3 = require('sqlite3').verbose();
const path = require('path');

document.getElementById('create-db').addEventListener('click', () => {
    const dbPath = path.join(__dirname, 'test.db');
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            document.getElementById('output').textContent = `Error: ${err.message}`;
            return;
        }
        document.getElementById('output').textContent = 'Database created successfully!';

        db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)', [], (err) => {
            if (err) {
                document.getElementById('output').textContent += `\nError creating table: ${err.message}`;
            } else {
                document.getElementById('output').textContent += '\nTable created successfully!';
            }
            db.close();
        });
    });
});
