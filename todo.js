const editorInput = document.querySelector('#editorInput');
const addButton = document.querySelector('#addButton');
const itemUl = document.querySelector('#itemUl');

function renderItem(id, todo, li) {
  const label = document.createElement('span');
  label.style.cssText = 'flex: 1;';
  li.append(label);

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = todo.done;
  label.append(input, ' ', todo.text);

  input.addEventListener('change', async () => {
    input.disabled = true;
    await fetch('/todos/' + id, { method: 'POST', body: JSON.stringify({ ...todo, done: input.checked }) });
    input.disabled = false;
    itemUl.prepend(li);
  });

  const renameButton = document.createElement('button');
  renameButton.textContent = 'Rename';
  li.append(renameButton);

  renameButton.addEventListener('click', async () => {
    const text = prompt('Name:', todo.text)?.trim();
    if (!text) {
      return;
    }

    renameButton.disabled = true;
    await fetch('/todos/' + id, { method: 'POST', body: JSON.stringify({ ...todo, text }) });
    renameButton.disabled = false;
    label.replaceChildren(input, ' ', text);
    itemUl.prepend(li);
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  li.append(deleteButton);

  deleteButton.addEventListener('click', async () => {
    if (!confirm(`Delete "${todo.text}"?`)) {
      return;
    }

    deleteButton.disabled = true;
    await fetch('/todos/' + id, { method: 'DELETE' });
    li.remove();
  });
}

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
