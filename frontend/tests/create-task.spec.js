import { test, expect } from '@playwright/test';

test('user can create a task', async ({ page }) => {
  const title = `My first task ${Date.now()}`;

  await page.goto('/');
  await page.getByPlaceholder('Enter task title').fill(title);

  await page.getByRole('button', { name: 'Add task' }).click();

  await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });
});