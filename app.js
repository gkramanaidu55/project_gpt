'use strict';

const STORAGE_KEY = 'little-tasks-v1';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const count = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const storageMessage = document.querySelector('#storage-message');
let tasks = [];

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!Array.isArray(saved) || !saved.every(task => task && typeof task.text === 'string' && typeof task.done === 'boolean')) {
    throw new Error('Invalid saved tasks');
  }
  tasks = saved;
} catch {
  showStorageMessage('Saved tasks could not be loaded. You can still use this list for this session.');
}

function showStorageMessage(message) {
  storageMessage.textContent = message;
  storageMessage.hidden = false;
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    showStorageMessage('Your browser could not save these tasks. They will remain available until you close or reload this page.');
  }
}

function render() {
  list.replaceChildren();
  tasks.forEach((task, index) => {
    const row = document.createElement('li');
    row.className = task.done ? 'task completed' : 'task';
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      row.classList.toggle('completed', task.done);
      updateCount();
      save();
    });
    const text = document.createElement('span');
    text.textContent = task.text;
    label.append(checkbox, text);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', `Delete task: ${task.text}`);
    remove.addEventListener('click', () => {
      tasks.splice(index, 1);
      save();
      render();
      const next = list.children[Math.min(index, tasks.length - 1)];
      if (next) next.querySelector('.delete').focus();
      else input.focus();
    });
    row.append(label, remove);
    list.append(row);
  });
  emptyState.hidden = tasks.length > 0;
  updateCount();
}

function updateCount() {
  count.textContent = `${tasks.filter(task => !task.done).length} remaining`;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  tasks.push({ text, done: false });
  save();
  render();
  form.reset();
  input.focus();
});

render();
