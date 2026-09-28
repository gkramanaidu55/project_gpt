# Little Tasks

A small task tracker built with plain HTML, CSS, and JavaScript.

## Run locally

Open index.html in your browser. No packages or build step are required.
Open this folder in VS Code to edit the application.

## Version 1

- Add tasks (up to 180 characters).
- Mark tasks complete or incomplete.
- Delete tasks.
- See how many tasks remain.
- Save tasks in the same browser using localStorage.
- Responsive layout for mobile and desktop.

## Files

- index.html: page structure
- styles.css: appearance and responsive layout
- app.js: task behavior and browser storage

## Storage and deployment

Tasks are saved locally in the browser, with no backend, account, or database.
Storage behavior for directly opened files varies by browser. For consistent
use and deployment, serve these three application files from any static web server.
Changing browsers, origins, or clearing browser data will not preserve the list.
Do not use this version to store sensitive information.

DevOps handoff: deploy index.html, styles.css, and app.js together. There are no
build commands, environment variables, or server dependencies for version 1.
