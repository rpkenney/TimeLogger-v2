const { createCRUDPage } = require('../crudPage/crudPage');
const { getDeletedTasks, insertTask, deleteTask, getTasks, updateTask, restoreTask } = require('../database');

createCRUDPage({
    entityName: 'task',
    insertFn: insertTask,
    deleteFn: deleteTask,
    getFn: getTasks,
    updateFn: updateTask,
    getDeletedFn: getDeletedTasks,
    restoreFn: restoreTask
});
