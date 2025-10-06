import { test, expect } from '@playwright/test';

test.describe('Homepage Critical Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display rotating gradient orb background', async ({ page }) => {
    const orb = page.locator('div.w-[600px].h-[600px].rounded-full');
    await expect(orb).toBeVisible();
    // Check for animation style presence
    const animation = await orb.evaluate((el) => window.getComputedStyle(el).animation);
    expect(animation).toContain('rotateGradient');
  });

  test('should have readable main heading and subheading', async ({ page }) => {
    const mainHeading = page.locator('h1', { hasText: 'Sistem Barang Hilang' });
    const subHeading = page.locator('h2', { hasText: 'Mahasiswa' });
    await expect(mainHeading).toBeVisible();
    await expect(subHeading).toBeVisible();
  });

  test('should navigate to login page on "Mulai Lapor" button click', async ({ page }) => {
    const button = page.locator('div', { hasText: 'Mulai Lapor' });
    await button.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('navbar links should be visible and clickable', async ({ page }) => {
    const homeLink = page.locator('a', { hasText: 'Home' });
    const featuresLink = page.locator('a', { hasText: 'Features' });
    const aboutLink = page.locator('a', { hasText: 'About' });
    const loginLink = page.locator('a', { hasText: 'Login' });

    await expect(homeLink).toBeVisible();
    await expect(featuresLink).toBeVisible();
    await expect(aboutLink).toBeVisible();
    await expect(loginLink).toBeVisible();

    // Click login link and verify navigation
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
