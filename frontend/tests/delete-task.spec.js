import { test, expect } from '@playwright/test';

test('user can delete a task', async ({ page }) => {
  const title = `Delete me ${Date.now()}`;

  await page.goto('/');
  await page.getByPlaceholder('Enter task title').fill(title);
  await page.getByRole('button', { name: 'Add task' }).click();

  const taskItem = page.locator('li', { hasText: title });
  await taskItem.locator('button:has-text("Delete")').click();

  await expect(page.getByText(title)).not.toBeVisible();
});