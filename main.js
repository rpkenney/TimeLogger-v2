const { app, BrowserWindow } = require('electron');
const path = require('path');
const { close, createClientsTable } = require('./database');

let mainWindow;

app.commandLine.appendSwitch('ignore-certificate-errors');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('entries/entries.html');
}

app.whenReady().then(() => {
    createWindow();
    createClientsTable();
});

app.on('window-all-closed', () => {
    close();
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
