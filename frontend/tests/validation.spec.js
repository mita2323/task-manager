import { test, expect } from '@playwright/test';

test('should not allow creating task without title', async ({ page }) => {
  await page.goto('/');

  await page.waitForLoadState('networkidle');

  const countBefore = await page.locator('li').count();

  await page.getByPlaceholder('Enter task title').fill('');
  await page.getByRole('button', { name: 'Add task' }).click();

  await page.waitForTimeout(500);

  await expect(page.locator('li')).toHaveCount(countBefore);
});