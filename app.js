'use strict';
const STORAGE_KEY = 'little-tasks-v1'; // Preserve version 1 data.
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const count = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const storageMessage = document.querySelector('#storage-message');
const announcement = document.querySelector('#task-announcement');
const filters = [...document.querySelectorAll('[data-filter]')];
let tasks = [];
let currentFilter = 'all';
let editingTask = null;
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!Array.isArray(saved) || !saved.every(task => task && typeof task.text === 'string' && typeof task.done === 'boolean')) throw new Error('Invalid saved tasks');
  tasks = saved;
} catch {
  showStorageMessage('Saved tasks could not be loaded. You can still use this list for this session.');
}
function showStorageMessage(message) {
  storageMessage.textContent = message;
  storageMessage.hidden = false;
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  catch { showStorageMessage('Your browser could not save these tasks. They will remain available until you close or reload this page.'); }
}
function button(text, className, action, accessibleName = text) {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = className;
  element.textContent = text;
  element.setAttribute('aria-label', accessibleName);
  element.addEventListener('click', action);
  return element;
}
function visibleTasks() {
  return tasks.filter(task => currentFilter === 'all' || (currentFilter === 'completed' ? task.done : !task.done));
}
function focusRow(index, selector = 'input') {
  const row = list.children[Math.min(index, list.children.length - 1)];
  if (row) row.querySelector(selector).focus();
  else filters.find(filter => filter.dataset.filter === currentFilter).focus();
}
function render() {
  list.replaceChildren();
  const visible = visibleTasks();
  visible.forEach((task, index) => {
    const row = document.createElement('li');
    row.className = task.done ? 'task completed' : 'task';
    if (editingTask === task) {
      const editor = document.createElement('form');
      editor.className = 'task-editor';
      const field = document.createElement('input');
      field.className = 'edit-input';
      field.setAttribute('aria-label', 'Edit task text');
      field.maxLength = 180;
      field.required = true;
      field.value = task.text;
      field.addEventListener('input', () => field.setCustomValidity(''));
      const cancel = () => { editingTask = null; render(); focusRow(index, '.edit'); };
      field.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); cancel(); }
      });
      const submit = document.createElement('button');
      submit.type = 'submit';
      submit.textContent = 'Save';
      editor.addEventListener('submit', event => {
        event.preventDefault();
        const text = field.value.trim();
        if (!text) { field.setCustomValidity('Enter a task name.'); field.reportValidity(); return; }
        task.text = text;
        editingTask = null;
        save(); render(); focusRow(index, '.edit');
        announcement.textContent = 'Task updated.';
      });
      editor.append(field, submit, button('Cancel', 'edit', cancel));
      row.append(editor);
    } else {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', () => {
        task.done = checkbox.checked;
        save(); render(); focusRow(index);
      });
      const text = document.createElement('span');
      text.textContent = task.text;
      label.append(checkbox, text);
      const edit = button('Edit', 'edit', () => {
        editingTask = task; render();
        const field = list.querySelector('.edit-input');
        field.focus(); field.select();
      }, `Edit task: ${task.text}`);
      const remove = button('Delete', 'delete', () => {
        tasks.splice(tasks.indexOf(task), 1);
        save(); render(); focusRow(index, '.delete');
        announcement.textContent = 'Task deleted.';
      }, `Delete task: ${task.text}`);
      row.append(label, edit, remove);
    }
    list.append(row);
  });
  emptyState.hidden = visible.length > 0;
  emptyState.querySelector('h3').textContent = currentFilter === 'all' ? 'A little room to focus.' : currentFilter === 'active' ? 'No active tasks.' : 'No completed tasks yet.';
  emptyState.querySelector('p').textContent = currentFilter === 'all' ? 'Add your first task above to get started.' : currentFilter === 'active' ? 'Add a new task or view all your tasks.' : 'Complete a task to see it here.';
  count.textContent = `${tasks.filter(task => !task.done).length} remaining`;
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.filter === currentFilter)));
}
filters.forEach(filter => filter.addEventListener('click', () => {
  currentFilter = filter.dataset.filter;
  editingTask = null;
  render();
}));
form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  tasks.push({ text, done: false });
  currentFilter = currentFilter === 'completed' ? 'active' : currentFilter;
  editingTask = null;
  save(); render(); form.reset(); input.focus();
  announcement.textContent = 'Task added.';
});
render();
