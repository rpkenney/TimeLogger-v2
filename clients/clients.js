document.addEventListener('DOMContentLoaded', () => {
    const { getDeletedClients, insertClient, deleteClient, getClients, updateClient, restoreClient } = require('../database');

    document.getElementById('data-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const inputValue = document.getElementById('text-input').value;
        insertClient(inputValue, (err) => {
            if (err) {
                document.getElementById('output').textContent = `Insert error: ${err.message}`;
            } else {
                document.getElementById('output').textContent = `Success: ${inputValue} added as a client`;
                document.getElementById('data-form').reset();
            }
        });

        getClientTable();
    });

    document.getElementById('restoreBtn')?.addEventListener('click', (event) => {
        const buttonText = event.target.textContent;

        if (buttonText.startsWith("Restore")) {
            getDeletedClientTable()
            event.target.textContent = "Return to active clients"
        } else {
            getClientTable()
            event.target.textContent = "Restore deleted clients"
        }
    });


    function removeClient(name) {
        console.log("removing client " + name);

        deleteClient(name, (err) => {
            if (err) {
                document.getElementById('output').textContent = `Delete error: ${err.message}`;
            } else {
                document.getElementById('output').textContent = `Success: ${name} removed as a client`;
            }
        });
    }

    function editClient(oldName, newName) {
        updateClient(oldName, newName, (err) => {
            if (err) {
                document.getElementById('output').textContent = `Update error: ${err.message}`
            } else {
                document.getElementById('output').textContent = `Success: ${oldName} is now ${newName}`;
                getClientTable();
            }
        });
    }

    function getClientTable() {
        getClients((err, rows) => {
            const list = document.getElementById('client-list');
            list.innerHTML = '';

            if (err) {
                list.textContent = `Fetch error: ${err.message}`;
            } else {
                if (rows.length === 0) {
                    list.textContent = 'No clients found.';
                } else {
                    rows.forEach((row, index) => {
                        const div = document.createElement('div');
                        div.style.display = 'flex';
                        div.style.alignItems = 'center';
                        div.style.gap = '8px';
                        div.style.padding = '5px';

                        if (index % 2 === 0) {
                            div.style.backgroundColor = '#e0e0e0'; // light gray
                        } else {
                            div.style.backgroundColor = '#ffffff'; // white
                        }

                        const nameSpan = document.createElement('span');
                        nameSpan.textContent = row.name;

                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Delete';
                        deleteBtn.onclick = () => {
                            removeClient(row.name)
                            div.remove();
                        };

                        const editBtn = document.createElement('button');
                        editBtn.textContent = 'Edit';
                        editBtn.onclick = () => {
                            // Replace name with input box and show submit button
                            const input = document.createElement('input');
                            input.type = 'text';
                            input.value = row.name;

                            const submitBtn = document.createElement('button');
                            submitBtn.textContent = 'Submit';

                            submitBtn.onclick = () => {
                                const newName = input.value.trim();
                                if (newName && newName !== row.name) {
                                    editClient(row.name, newName)
                                }
                            };

                            const cancelBtn = document.createElement('button')
                            cancelBtn.textContent = 'Cancel';

                            cancelBtn.onclick = () => {
                                getClientTable()
                            };

                            // Replace span and edit button with input and submit button
                            div.replaceChild(input, nameSpan);
                            div.replaceChild(submitBtn, editBtn);
                            div.replaceChild(cancelBtn, deleteBtn);
                        };

                        div.appendChild(editBtn);
                        div.appendChild(deleteBtn);
                        div.appendChild(nameSpan);
                        list.appendChild(div);
                    });
                }
            }
        });
    }

    function getDeletedClientTable() {
        getDeletedClients((err, rows) => {
            const list = document.getElementById('client-list');
            list.innerHTML = '';

            if (err) {
                list.textContent = `Fetch error: ${err.message}`;
            } else {
                if (rows.length === 0) {
                    list.textContent = 'No clients found.';
                } else {
                    rows.forEach((row, index) => {
                        const div = document.createElement('div');
                        div.style.display = 'flex';
                        div.style.alignItems = 'center';
                        div.style.gap = '8px';
                        div.style.padding = '5px'
                        if (index % 2 === 0) {
                            div.style.backgroundColor = '#e0e0e0'; // light gray
                        } else {
                            div.style.backgroundColor = '#ffffff'; // white
                        }

                        const nameSpan = document.createElement('span');
                        nameSpan.textContent = row.name;

                        const restoreButton = document.createElement('button');
                        restoreButton.textContent = 'Restore';
                        restoreButton.onclick = () => {
                            restoreClient(row.name, (err) => {
                                if (err) {
                                    document.getElementById('output').textContent = `Restore error: ${err.message}`;
                                } else {
                                    document.getElementById('output').textContent = `Success ${row.name} restored as a client`;
                                }
                            });
                            div.remove();
                        };
                        div.appendChild(restoreButton);
                        div.appendChild(nameSpan);
                        list.appendChild(div);
                    });
                }
            }
        });
    }

    getClientTable();
});