import { test, expect } from '@playwright/test'

test('basic tests', async ({ page }) => {
  await page.goto('/?test=1')
  await expect(page).toHaveTitle(/simulai/)
})
