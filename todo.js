const editorInput = document.querySelector('#editorInput');
const addButton = document.querySelector('#addButton');
const itemUl = document.querySelector('#itemUl');

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

    const label = document.createElement('span');
    label.style.cssText = 'flex: 1;';
    li.append(label);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = todo.done;
    label.append(input, ' ', todo.text);

    input.addEventListener('change', async () => {
      await fetch('/todos/' + id, { method: 'POST', body: JSON.stringify({ ...todo, done: input.checked }) });
      await render();
    });

    const renameButton = document.createElement('button');
    renameButton.textContent = 'Rename';
    li.append(renameButton);

    renameButton.addEventListener('click', async () => {
      const text = prompt('Name:', todo.text)?.trim();
      if (!text) {
        return;
      }

      await fetch('/todos/' + id, { method: 'POST', body: JSON.stringify({ ...todo, text }) });
      await render();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    li.append(deleteButton);

    deleteButton.addEventListener('click', async () => {
      if (!confirm(`Delete "${todo.text}"?`)) {
        return;
      }

      await fetch('/todos/' + id, { method: 'DELETE' });
      await render();
    });
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

  await fetch('/todos/' + value, { method: 'POST', body: JSON.stringify({ text: value }) });
  editorInput.value = '';
  await render();
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
