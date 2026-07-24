import { expect, type Locator, type Page, test } from '@playwright/test';

function revealTarget(page: Page, id: string) {
  return page.locator(`[data-terminal-reveal-target="${id}"]`);
}

async function opacityOf(locator: Locator) {
  return locator.evaluate((element) => Number(getComputedStyle(element).opacity));
}

test('scrolling an offscreen terminal into view animates it from hidden to visible', async ({
  page,
}) => {
  await page.goto('/');
  const experienceTerminal = revealTarget(page, 'experience-terminal');
  await expect(experienceTerminal).toBeAttached();
  await expect.poll(() => opacityOf(experienceTerminal)).toBe(0);

  await page.locator('#experience').scrollIntoViewIfNeeded();

  await expect.poll(() => opacityOf(experienceTerminal)).toBeGreaterThan(0);
  await expect.poll(() => opacityOf(experienceTerminal)).toBe(1);
  await expect
    .poll(() =>
      experienceTerminal.evaluate((element) => getComputedStyle(element).transform),
    )
    .toBe('matrix(1, 0, 0, 1, 0, 0)');
});

test('a terminal below the viewport hides and animates in again when revisited', async ({
  page,
}) => {
  await page.goto('/');
  const experienceTerminal = revealTarget(page, 'experience-terminal');
  await page.locator('#experience').scrollIntoViewIfNeeded();
  await expect.poll(() => opacityOf(experienceTerminal)).toBe(1);

  await page.locator('#home').scrollIntoViewIfNeeded();
  await expect.poll(() => opacityOf(experienceTerminal)).toBe(0);

  await page.locator('#experience').scrollIntoViewIfNeeded();
  await expect.poll(() => opacityOf(experienceTerminal)).toBe(1);
});

test('reduced-motion preference shows terminals without entrance animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const experienceTerminal = revealTarget(page, 'experience-terminal');
  await expect(experienceTerminal).toBeAttached();
  await expect.poll(() => opacityOf(experienceTerminal)).toBe(1);
  await expect
    .poll(() =>
      experienceTerminal.evaluate((element) => getComputedStyle(element).transform),
    )
    .toBe('matrix(1, 0, 0, 1, 0, 0)');
});
