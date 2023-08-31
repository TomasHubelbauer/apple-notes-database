import { test, expect } from "@playwright/test";

!process.env.CI && test('deleting a to-do item works', async ({ page }) => {
  await page.goto('/todo.html');
  await page.waitForResponse('/todos?full');

  await expect(page.locator('ul')).not.toHaveText('Loading…');

  const lis = await page.locator('li', { hasText: /Test (adding|renaming) a new item \(\d+\)/ }).all();
  console.log(`Found ${lis.length} to-do items to delete`);

  page.on('dialog', async dialog => dialog.accept());

  for (const li of lis) {
    const text = await li.locator('span').textContent();
    if (!text) {
      throw new Error('No text found');
    }

    const deleteButton = li.locator('button:text("Delete")');
    await deleteButton.click();
    await expect(deleteButton).toBeDisabled();

    const regex = new RegExp('/todos/' + encodeURIComponent(text).replace('(', '\\(').replace(')', '\\)').replace(/(adding|renaming)/, '(adding|renaming)'));
    await page.waitForResponse(regex);
    await expect(li).not.toBeAttached();

    console.log(`Deleted the '${text}' to-do item`);
  }

  if (lis.length > 0) {
    await page.reload();
    await page.waitForResponse('/todos?full');
    await expect(page.locator('ul')).not.toHaveText('Loading…');
    expect(await page.locator('li', { hasText: /Test (adding|renaming) a new item \(\d+\)/ }).count()).toBe(0);
    console.log(`Deleted all ${lis.length} to-do items`);
  }
});

!process.env.CI && test('adding a new to-do item by pressing the button works', async ({ page }) => {
  await page.goto('/todo.html');
  await page.waitForResponse('/todos?full');

  const name = `Test adding a new item (${Date.now()})`;
  const addButton = page.locator('button:text("Add")');

  await expect(addButton).toBeDisabled();
  await page.getByPlaceholder('Add a new to-do item…').type(name);
  await expect(addButton).toBeEnabled();

  await addButton.click();
  await expect(addButton).toBeDisabled();
  await page.waitForResponse('/todos/' + encodeURIComponent(name));
  await expect(addButton).toBeDisabled();

  const nameSpan = page.locator(`span:text("${name}")`);

  await expect(nameSpan).toBeAttached();
  await page.reload();
  await expect(nameSpan).toBeAttached();

  console.log(`Added a new to-do item with the name '${name}'`);
});

!process.env.CI && test('renaming a to-do item works', async ({ page }) => {
  await page.goto('/todo.html');
  await page.waitForResponse('/todos?full');

  await expect(page.locator('ul')).not.toHaveText('Loading…');

  const li = page.locator('li', { hasText: /Test adding a new item \(\d+\)/ }).first();
  await expect(li).toBeAttached();

  const oldText = await li.locator('span').textContent();
  if (!oldText) {
    throw new Error('No text found');
  }

  const newText = oldText.replace('adding', 'renaming');
  page.on('dialog', async dialog => dialog.accept(newText));

  const renameButton = li.locator('button:text("Rename")');
  await renameButton.click();
  await expect(renameButton).toBeDisabled();

  await page.waitForResponse('/todos/' + encodeURIComponent(oldText));
  await expect(renameButton).not.toBeAttached();
  await expect(page.locator('li', { hasText: newText })).toBeAttached();
  await page.reload();
  await expect(page.locator('li', { hasText: newText })).toBeAttached();

  console.log(`Renamed the '${oldText}' to-do item to '${newText}'`);
});

!process.env.CI && test('toggling a to-do item works', async ({ page }) => {
  await page.goto('/todo.html');
  await page.waitForResponse('/todos?full');

  await expect(page.locator('ul')).not.toHaveText('Loading…');

  const li = page.locator('li', { hasText: /Test (adding|renaming) a new item \(\d+\)/ }).first();
  await expect(li).toBeAttached();

  const text = await li.locator('span').textContent();
  if (!text) {
    throw new Error('No text found');
  }

  const toggleInput = li.locator('input');
  const isDone = await toggleInput.isChecked();
  await toggleInput.click();
  await expect(toggleInput).toBeDisabled();

  const regex = new RegExp('/todos/' + encodeURIComponent(text).replace('(', '\\(').replace(')', '\\)').replace(/(adding|renaming)/, '(adding|renaming)'));
  await page.waitForResponse(regex);

  await expect(page.locator('li', { hasText: text })).toBeAttached();
  await expect(page.locator('li', { hasText: text }).locator('input')).toBeChecked({ checked: !isDone });
  await page.reload();
  await expect(page.locator('li', { hasText: text }).locator('input')).toBeChecked({ checked: !isDone });

  console.log(`Toggled the '${text}' to-do item from '${isDone ? 'done' : 'not done'}' to '${isDone ? 'not done' : 'done'}'`);
});
