const { app, BrowserWindow } = require('electron');
const path = require('path');
const { openDatabase, createClientsTable } = require('./database');

let mainWindow;

app.commandLine.appendSwitch('ignore-certificate-errors');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    // Open DB and create table at startup
    const db = openDatabase();
    createClientsTable(db, (err) => {
        if (err) {
            console.error('Failed to create clients table:', err);
        } else {
            console.log('Clients table created or already exists');
        }
        db.close();

        // After DB setup, create the window
        createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
