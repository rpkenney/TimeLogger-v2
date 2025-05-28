const { app, BrowserWindow } = require('electron');
const path = require('path');
const { close, createClientsTable, createHourlyRateTable, initHourlyRateTable, createTasksTable } = require('./database');

let mainWindow;

app.commandLine.appendSwitch('ignore-certificate-errors');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            //preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('entries/entries.html');
}

app.whenReady().then(() => {
    createWindow();
    createClientsTable();
    createTasksTable();
    createHourlyRateTable(() => {
        initHourlyRateTable((err) => {
            if (err) console.error('Insert failed:', err);
            else console.log('Table initialized.');
        });
    });

});

app.on('window-all-closed', () => {
    close();
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
