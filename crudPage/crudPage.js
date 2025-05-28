function createCRUDPage({
    entityName,
    insertFn,
    deleteFn,
    getFn,
    updateFn,
    getDeletedFn,
    restoreFn
}) {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('data-form');
        const input = document.getElementById('text-input');
        const output = document.getElementById('output');
        const list = document.getElementById(`${entityName}-list`);
        const restoreBtn = document.getElementById('restoreBtn');

        form?.addEventListener('submit', (event) => {
            event.preventDefault();
            const value = input.value.trim();
            if (!value) return;

            insertFn(value, (err) => {
                output.textContent = err ? `Insert error: ${err.message}` :
                    `Success: ${value} added as a ${entityName}`;
                if (!err) form.reset();
                renderTable();
            });
        });

        restoreBtn?.addEventListener('click', (event) => {
            const text = event.target.textContent;
            if (text.startsWith("Restore")) {
                renderDeletedTable();
                event.target.textContent = `Return to active ${entityName}s`;
            } else {
                renderTable();
                event.target.textContent = `Restore deleted ${entityName}s`;
            }
        });

        function renderTable() {
            getFn((err, rows) => {
                list.innerHTML = '';
                if (err) {
                    list.textContent = `Fetch error: ${err.message}`;
                    return;
                }
                if (rows.length === 0) {
                    list.textContent = `No ${entityName}s found.`;
                    return;
                }

                rows.forEach((row, index) => {
                    const div = document.createElement('div');
                    div.style.display = 'flex';
                    div.style.alignItems = 'center';
                    div.style.gap = '8px';
                    div.style.padding = '5px';
                    div.style.backgroundColor = index % 2 === 0 ? '#e0e0e0' : '#ffffff';

                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = row.name;

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.onclick = () => {
                        deleteFn(row.name, (err) => {
                            output.textContent = err ? `Delete error: ${err.message}` :
                                `Success: ${row.name} removed as a ${entityName}`;
                            renderTable();
                        });
                    };

                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Edit';
                    editBtn.onclick = () => {
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.value = row.name;

                        const submitBtn = document.createElement('button');
                        submitBtn.textContent = 'Submit';
                        submitBtn.onclick = () => {
                            const newName = input.value.trim();
                            if (newName && newName !== row.name) {
                                updateFn(row.name, newName, (err) => {
                                    output.textContent = err ? `Update error: ${err.message}` :
                                        `Success: ${row.name} is now ${newName}`;
                                    renderTable();
                                });
                            }
                        };

                        const cancelBtn = document.createElement('button');
                        cancelBtn.textContent = 'Cancel';
                        cancelBtn.onclick = renderTable;

                        div.replaceChild(input, nameSpan);
                        div.replaceChild(submitBtn, editBtn);
                        div.replaceChild(cancelBtn, deleteBtn);
                    };

                    div.append(nameSpan, editBtn, deleteBtn);
                    list.appendChild(div);
                });
            });
        }

        function renderDeletedTable() {
            getDeletedFn((err, rows) => {
                list.innerHTML = '';
                if (err) {
                    list.textContent = `Fetch error: ${err.message}`;
                    return;
                }

                if (rows.length === 0) {
                    list.textContent = `No deleted ${entityName}s found.`;
                    return;
                }

                rows.forEach((row, index) => {
                    const div = document.createElement('div');
                    div.style.display = 'flex';
                    div.style.alignItems = 'center';
                    div.style.gap = '8px';
                    div.style.padding = '5px';
                    div.style.backgroundColor = index % 2 === 0 ? '#e0e0e0' : '#ffffff';

                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = row.name;

                    const restoreBtn = document.createElement('button');
                    restoreBtn.textContent = 'Restore';
                    restoreBtn.onclick = () => {
                        restoreFn(row.name, (err) => {
                            output.textContent = err ? `Restore error: ${err.message}` :
                                `Success: ${row.name} restored as a ${entityName}`;
                            renderDeletedTable();
                        });
                    };

                    div.append(nameSpan, restoreBtn);
                    list.appendChild(div);
                });
            });
        }

        renderTable();
    });
}

module.exports = { createCRUDPage };
