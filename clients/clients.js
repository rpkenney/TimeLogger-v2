const { createCRUDPage } = require('../crudPage/crudPage');
const { getDeletedClients, insertClient, deleteClient, getClients, updateClient, restoreClient } = require('../database');

createCRUDPage({
    entityName: 'client',
    insertFn: insertClient,
    deleteFn: deleteClient,
    getFn: getClients,
    updateFn: updateClient,
    getDeletedFn: getDeletedClients,
    restoreFn: restoreClient
});
