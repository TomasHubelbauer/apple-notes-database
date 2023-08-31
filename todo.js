import renderItem from './renderItem.js';

const editorInput = document.querySelector('#editorInput');
const addButton = document.querySelector('#addButton');
const itemUl = document.querySelector('#itemUl');

async function render() {
  itemUl.replaceChildren('Loading…');
  const response = await fetch('/todos?full');
  const todos = await response.json();
  itemUl.replaceChildren();

  for (const { id, data: todo } of todos) {
    const li = document.createElement('li');
    li.style.cssText = 'display: flex; gap: 1ex;';
    renderItem(id, todo, li);
    itemUl.append(li);
  }
}

await render();

editorInput.addEventListener('keydown', async (event) => {
  const value = editorInput.value.trim();
  addButton.disabled = !value;

  if (!value) {
    return;
  }

  if (event.key !== 'Enter') {
    return;
  }

  editorInput.disabled = true;
  await fetch('/todos/' + value, { method: 'POST', body: JSON.stringify({ text: value }) });
  editorInput.value = '';
  editorInput.disabled = false;

  const li = document.createElement('li');
  li.style.cssText = 'display: flex; gap: 1ex;';
  itemUl.prepend(li);
  renderItem(value, { text: value, done: false }, li);
});

addButton.addEventListener('click', async () => {
  const value = editorInput.value.trim();
  if (!value) {
    return;
  }

  await fetch('/todos/' + value, { method: 'POST', body: JSON.stringify({ text: value }) });
  editorInput.value = '';
  await render();
});
