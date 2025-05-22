document.addEventListener('DOMContentLoaded', () => {
    const { openDatabase, createClientsTable, insertClient, getClients } = require('./database');

    document.getElementById('data-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const inputValue = document.getElementById('text-input').value;
        const db = openDatabase();

        insertClient(db, inputValue, (err) => {
            if (err) {
                document.getElementById('output').textContent += `\nInsert error: ${err.message}`;
            } else {
                document.getElementById('output').textContent += `\nClient added!`;
            }
            db.close();
        });
    });

    function getClientTable(db) {
        getClients(db, (err, rows) => {
            const list = document.getElementById('client-list');
            list.innerHTML = '';

            if (err) {
                list.textContent = `Fetch error: ${err.message}`;
            } else {
                if (rows.length === 0) {
                    list.textContent = 'No clients found.';
                } else {
                    rows.forEach(row => {
                        const div = document.createElement('div');
                        div.textContent = row.name;
                        list.appendChild(div);
                    });
                }
            }
        });
    }

    document.getElementById('refresh-list').addEventListener('click', () => {
        const db = openDatabase();
        getClientTable(db);
        db.close()
    });
});
