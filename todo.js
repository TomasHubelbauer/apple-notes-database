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
  const response = await fetch('/todos');
  itemUl.replaceChildren();

  const ids = await response.json();
  const lis = {};
  for (const id of ids) {
    const li = document.createElement('li');
    li.style.cssText = 'display: flex; gap: 1ex;';
    li.textContent = `Loading "${id}"…`;
    lis[id] = li;
    itemUl.append(li);
  }

  for (const id of ids) {
    const response = await fetch('/todos/' + id);
    const todo = await response.json();

    const li = lis[id];
    li.replaceChildren();
    renderItem(id, todo, li);
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
