import { expect, type Locator, type Page, test } from '@playwright/test';

function terminal(page: Page, id: string) {
  return page.locator(`[data-terminal-id="${id}"]`);
}

async function dragBy(page: Page, window: Locator, deltaX: number, deltaY: number) {
  const handle = window.locator('.terminal-drag-handle');
  const box = await handle.boundingBox();
  expect(box).not.toBeNull();

  const startX = box!.x + box!.width / 2;
  const startY = box!.y + box!.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + deltaX, startY + deltaY, { steps: 10 });
  await page.mouse.up();
}

async function zIndex(window: Locator) {
  return Number(await window.evaluate((element) => getComputedStyle(element).zIndex));
}

test.beforeEach(async ({ page }) => {
  await page.goto('/projects');
  await expect(terminal(page, 'projects-terminal')).toBeVisible();
});

test('drags a window by its title bar', async ({ page }) => {
  const window = terminal(page, 'projects-terminal');
  const before = await window.boundingBox();
  expect(before).not.toBeNull();

  await dragBy(page, window, 140, 90);

  await expect.poll(async () => (await window.boundingBox())?.x).toBeCloseTo(before!.x + 140, 0);
  await expect.poll(async () => (await window.boundingBox())?.y).toBeCloseTo(before!.y + 90, 0);
});

test('clicking the exposed part of a stacked lower window brings it to front', async ({ page }) => {
  const lowerWindow = terminal(page, 'projects-terminal');
  const upperWindow = terminal(page, 'projects-page-newb');
  await expect(upperWindow).toBeVisible();

  const lowerBox = await lowerWindow.boundingBox();
  const upperBox = await upperWindow.boundingBox();
  expect(lowerBox).not.toBeNull();
  expect(upperBox).not.toBeNull();

  await dragBy(
    page,
    upperWindow,
    lowerBox!.x + 80 - upperBox!.x,
    lowerBox!.y + 70 - upperBox!.y,
  );
  expect(await zIndex(upperWindow)).toBeGreaterThan(await zIndex(lowerWindow));

  await lowerWindow.locator('input').click();
  await expect.poll(() => zIndex(lowerWindow)).toBeGreaterThan(await zIndex(upperWindow));
});

test('resizes a window from the bottom-right corner', async ({ page }) => {
  const window = terminal(page, 'projects-terminal');
  const before = await window.boundingBox();
  expect(before).not.toBeNull();

  await page.mouse.move(before!.x + before!.width - 2, before!.y + before!.height - 2);
  await page.mouse.down();
  await page.mouse.move(before!.x + before!.width + 120, before!.y + before!.height + 80, {
    steps: 10,
  });
  await page.mouse.up();

  await expect.poll(async () => (await window.boundingBox())?.width).toBeGreaterThan(before!.width + 100);
  await expect.poll(async () => (await window.boundingBox())?.height).toBeGreaterThan(before!.height + 60);
});

test('does not resize below the configured minimum dimensions', async ({ page }) => {
  const window = terminal(page, 'projects-terminal');
  const before = await window.boundingBox();
  expect(before).not.toBeNull();

  await page.mouse.move(before!.x + before!.width - 2, before!.y + before!.height - 2);
  await page.mouse.down();
  await page.mouse.move(before!.x + 20, before!.y + 20, { steps: 10 });
  await page.mouse.up();

  const after = await window.boundingBox();
  expect(after).not.toBeNull();
  expect(after!.width).toBeGreaterThanOrEqual(420);
  expect(after!.height).toBeGreaterThanOrEqual(190);
});

test('maximizes and restores a window with the green control', async ({ page }) => {
  const window = terminal(page, 'projects-terminal');
  const maximize = window.getByTitle('Maximize');
  const before = await window.boundingBox();
  expect(before).not.toBeNull();

  await maximize.click();

  await expect(window.getByTitle('Restore')).toBeVisible();
  await expect.poll(async () => (await window.boundingBox())?.width).toBe(1340);
  await expect.poll(async () => (await window.boundingBox())?.height).toBe(850);

  await window.getByTitle('Restore').click();
  await expect.poll(async () => (await window.boundingBox())?.width).toBeCloseTo(before!.width, 0);
  await expect.poll(async () => (await window.boundingBox())?.height).toBeCloseTo(before!.height, 0);
});

test('minimizes a window and restores it from the dock', async ({ page }) => {
  const window = terminal(page, 'projects-terminal');
  await window.getByTitle('Minimize').click();

  await expect(window).toBeHidden();
  const dockButton = page.locator('button[title="~/projects"]');
  await expect(dockButton).toBeVisible();
  await dockButton.click();

  await expect(window).toBeVisible();
});

test('closes a window and removes it from the dock', async ({ page }) => {
  const window = terminal(page, 'projects-terminal');
  await window.getByTitle('Close').click();

  await expect(window).toHaveCount(0);
  await expect(page.locator('button[title="~/projects"]')).toHaveCount(0);
});
