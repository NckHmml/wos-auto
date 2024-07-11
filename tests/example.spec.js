// @ts-check
const { test } = require('@playwright/test');
const { readFile } = require("fs/promises");

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

test("default", async ({ page }) => {
  const giftCode = await readFile("./giftcode.txt").then(b => b.toString("utf8"));
  const playerIds = (await readFile("./players.txt").then(b => b.toString("utf8"))).trim().split(/\n|,/).map(x => x.trim());
  for (const playerId of playerIds) {
    if (!playerId) continue;

    await page.goto("https://wos-giftcode.centurygame.com/");
  
    await page.waitForSelector("[placeholder='Player ID']");
    await page.waitForTimeout(random(750, 1500));

    await page.locator("[placeholder='Player ID']").pressSequentially(playerId, { delay: random(60, 80) });

    await page.locator(".login_btn").click();
    await page.waitForSelector(".img.avatar");
    await page.waitForTimeout(random(200, 500));

    await page.locator("[placeholder='Enter Gift Code']").pressSequentially(giftCode, { delay: random(60, 80) });
    await page.waitForTimeout(random(200, 500));
  
    await page.locator(".exchange_btn").click();
    await page.waitForSelector(".message_modal");
    await page.waitForTimeout(random(200, 500));

    await page.locator(".message_modal .confirm_btn").click();
  }
});
