import { test, expect } from "@playwright/test";

test('has title', async ({ page }) => {
  await page.goto('/todo.html');
  await expect(page).toHaveTitle('To-Do List');
});
