export default function renderItem(id, todo, li) {
  const label = document.createElement('label');
  label.style.cssText = 'display: flex; flex: 1; gap: 1ex;';
  li.append(label);

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = todo.done;
  label.append(input);

  input.addEventListener('change', async () => {
    input.disabled = true;
    await fetch('/todos/' + id, { method: 'POST', body: JSON.stringify({ ...todo, done: input.checked }) });
    input.disabled = false;
    itemUl.prepend(li);
  });

  const nameSpan = document.createElement('span');
  nameSpan.textContent = todo.text;
  label.append(nameSpan);

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
