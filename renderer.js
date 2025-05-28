document.addEventListener('DOMContentLoaded', () => {

    const nav = document.createElement('nav');
    nav.innerHTML = `
      <style>
        nav {
          background-color: #333;
          padding: 10px;
          display: flex;
          gap: 10px;
        }
        nav button {
          color: white;
          background: none;
          border: 1px solid white;
          padding: 5px 10px;
          cursor: pointer;
        }
      </style>
      <button id="homeBtn">Entries</button>
      <button id="reportsBtn">Reports</button>
      <button id="clientsBtn">Clients</button>
      <button id="tasksBtn">Tasks</button>
      <button id="rateBtn">Rate</button>
      <button id="aboutBtn">About</button>
    `;

    document.body.prepend(nav);

    const current = window.location.pathname;

    document.getElementById('homeBtn')?.addEventListener('click', () => {
        if (!current.endsWith('entries.html')) {
            window.location.href = `${process.cwd()}/entries/entries.html`;
        }
    });


    document.getElementById('clientsBtn')?.addEventListener('click', () => {
        if (!current.endsWith('clients.html')) {
            window.location.href = `${process.cwd()}/clients/clients.html`;
        }
    });

    document.getElementById('rateBtn')?.addEventListener('click', () => {
        if (!current.endsWith('rate.html')) {
            window.location.href = `${process.cwd()}/rate/rate.html`;
        }
    });

    document.getElementById('tasksBtn')?.addEventListener('click', () => {
        if (!current.endsWith('tasks.html')) {
            window.location.href = `${process.cwd()}/tasks/tasks.html`;
        }
    });

    document.getElementById('reportsBtn')?.addEventListener('click', () => {
        if (!current.endsWith('reports.html')) {
            window.location.href = `${process.cwd()}/reports/reports.html`;
        }
    });

    document.getElementById('aboutBtn')?.addEventListener('click', () => {
        if (!current.endsWith('about.html')) {
            window.location.href = `${process.cwd()}/about/about.html`;
        }
    });
});
