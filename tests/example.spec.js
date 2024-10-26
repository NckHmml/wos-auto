// @ts-check
const { test } = require("@playwright/test");
const { readFileSync } = require("fs");

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const giftCode = readFileSync("./giftcode.txt").toString("utf-8");
const playerIds = readFileSync("./players.txt")
  .toString("utf8")
  .trim()
  .split(/\n|,/)
  .map(x => x.trim())
  .filter((x, i, a) => a.indexOf(x) === i);

test.describe(`Running "${giftCode}"`, () => {
  for (const playerId of playerIds) {
    if (!playerId) continue;
    
    test(`player "${playerId}"`, async ({page}) => {

      await page.goto("https://wos-giftcode.centurygame.com/");
    
      await page.waitForSelector("[placeholder='Player ID']");
      await page.waitForTimeout(random(750, 1500));
  
      await page.locator("[placeholder='Player ID']").pressSequentially(playerId, { delay: random(60, 80) });
  
      await page.locator(".login_btn").click();
      let failed = false;
      try {
        await page.waitForSelector(".img.avatar", { timeout: 2000 });
        await page.waitForTimeout(random(200, 500));
    
        await page.locator("[placeholder='Enter Gift Code']").pressSequentially(giftCode, { delay: random(60, 80) });
        await page.waitForTimeout(random(200, 500));
      
        await page.locator(".exchange_btn").click();
      } catch {
        failed = true;
      }
      await page.waitForSelector(".message_modal");
      await page.waitForTimeout(random(200, 500));
  
      await page.locator(".message_modal .confirm_btn").click();

      if (failed) {
        throw `Avatar not found after 2 seconds for player "${playerId}"`;
      }

    });
  }

});
