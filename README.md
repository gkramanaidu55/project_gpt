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

## Version 2 release handoff

- Edit a task inline with Save or Cancel. Enter saves; Escape cancels.
- Filter tasks using All, Active, or Completed. The remaining count always covers all tasks.
- Changing filters cancels an unsaved edit. Adding from Completed switches to Active.
- Existing version 1 browser data is retained using the same storage key and format.
- Deploy the same three files together. No infrastructure, build, or database changes.
- Rollback: redeploy the previous version of the three files. Saved data is compatible.
- Smoke check: edit and reload; cancel an edit; test each filter; complete/reopen/delete
  a task while filtered; confirm the intended task changes and counts remain correct.
