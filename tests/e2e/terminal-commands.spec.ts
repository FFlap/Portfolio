import { expect, type Locator, test } from '@playwright/test';

async function runCommand(input: Locator, command: string) {
  await input.fill(command);
  await input.press('Enter');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/projects');
});

test('help lists the available terminal commands', async ({ page }) => {
  const window = page.locator('[data-terminal-id="projects-terminal"]');
  await runCommand(window.locator('input'), 'help');

  await expect(window).toContainText('Available commands:');
  await expect(window).toContainText('theme <name>');
  await expect(window).toContainText('background <3d|simple>');
});

test('skills prints the portfolio skill groups', async ({ page }) => {
  const window = page.locator('[data-terminal-id="projects-terminal"]');
  await runCommand(window.locator('input'), 'skills');

  await expect(window.getByText('Languages:', { exact: false })).toBeVisible();
});

test('theme command changes the active theme and persists it', async ({ page }) => {
  const window = page.locator('[data-terminal-id="projects-terminal"]');
  await runCommand(window.locator('input'), 'theme orange');

  await expect(window).toContainText('Theme switched to orange');
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary-color')))
    .toBe('#fb923c');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('orange');
});

test('invalid commands show a useful error', async ({ page }) => {
  const window = page.locator('[data-terminal-id="projects-terminal"]');
  await runCommand(window.locator('input'), 'definitely-not-a-command');

  await expect(window).toContainText(
    "Command not found: definitely-not-a-command. Type 'help' for available commands.",
  );
});

test('clear removes command history', async ({ page }) => {
  const window = page.locator('[data-terminal-id="projects-terminal"]');
  const input = window.locator('input');
  await runCommand(input, 'help');
  await expect(window).toContainText('Available commands:');

  await runCommand(input, 'clear');

  await expect(window).not.toContainText('Available commands:');
  await expect(window).not.toContainText('clear');
});
