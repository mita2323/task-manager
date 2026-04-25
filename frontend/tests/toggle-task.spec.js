import { test, expect } from '@playwright/test';

test('user can mark task as completed', async ({ page }) => {
  const title = `Task ${Date.now()}`;

  await page.goto('/');
  await page.getByPlaceholder('Enter task title').fill(title);
  await page.getByRole('button', { name: 'Add task' }).click();

  const taskItem = page.locator('li', { hasText: title });
  const checkbox = taskItem.locator('input[type="checkbox"]');
  await checkbox.click();

  await expect(checkbox).toBeChecked({ timeout: 5000 });
});