import { test, expect } from '@playwright/test';

test('existing tasks are visible on page load', async ({ page }) => {
  const title = `View test ${Date.now()}`;

  await page.goto('/');
  await page.getByPlaceholder('Enter task title').fill(title);
  await page.getByRole('button', { name: 'Add task' }).click();
  await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });

  await page.reload();

  await expect(page.locator('li')).not.toHaveCount(0);
  await expect(page.getByText(title)).toBeVisible();
});