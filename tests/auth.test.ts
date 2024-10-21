/**
 * Copyright 2024 Defense Unicorns
 * SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial
 */

import { test, expect } from "@playwright/test";

test("login thru device flow", async ({ page }) => {
  console.log("device code: " + process.env.DEVICE_CODE)
  await page.goto('/realms/uds/device');

  await page.getByLabel("Enter the code provided by your device and click Submit").fill(process.env.DEVICE_CODE!);
  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL('/realms/uds/login-actions/authenticate*');

  await page.getByLabel("Username or email").fill("doug");
  await page.getByLabel("Password").fill("unicorn123!@#UN");
  await page.getByRole("button", { name: "Log In" }).click();

  await page.waitForURL('/realms/uds/login-actions/required-action*');
  await page.getByRole("button", { name: "Yes" }).click();

  await page.waitForURL('/realms/uds/device/status');

  const instructionBox = page.locator('.instruction');
  await expect(instructionBox).toContainText("You may close this browser window and go back to your device.")
});
