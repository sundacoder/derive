import { expect, test } from "@playwright/test";

test.describe("DERIVE Trade Flow (E2E)", () => {
  test("F1: Connect Wallet", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Connect Wallet" }).click();
    await page.getByText("Stronghold (Dev Mode)").click();
    await expect(page.getByText("Wallet connected")).toBeVisible();
  });

  test("F2: Propose and Accept Trade", async ({ page }) => {
    await page.goto("/trade");
    await page.getByRole("button", { name: "Propose Trade" }).click();
    await page.getByLabel("Counterparty").fill("DealerB");
    await page.getByLabel("Notional Amount ($)").fill("1000000");
    await page.getByLabel("Fixed Rate (%)").fill("5.00");
    await page.getByRole("button", { name: "Submit Proposal" }).click();
    await expect(page.getByText("pending_acceptor")).toBeVisible();
  });

  test("F3: Demand and Post Margin", async ({ page }) => {
    await page.goto("/margin");
    await page.getByRole("button", { name: "Demand Margin" }).click();
    await page.getByLabel("Called Dealer").fill("DealerB");
    await page.getByLabel("Trade ID").fill("trade-001");
    await page.getByLabel("Amount Required ($)").fill("50000");
    await page.getByRole("button", { name: "Issue Margin Call" }).click();
    await expect(page.getByText("Demanded")).toBeVisible();
  });

  test("F4: Initiate Novation", async ({ page }) => {
    await page.goto("/novation");
    await page.getByRole("button", { name: "Initiate Novation" }).click();
    await page.getByLabel("Remaining Dealer").fill("DealerB");
    await page.getByLabel("Incoming Dealer").fill("DealerC");
    await page.getByLabel("Original Trade ID").fill("trade-001");
    await page.getByLabel("Novated Notional ($)").fill("500000");
    await page.getByRole("button", { name: "Initiate Novation" }).click();
    await expect(page.getByText("pending_signatures")).toBeVisible();
  });

  test("F5: Publish Disclosure", async ({ page }) => {
    await page.goto("/disclosure");
    await page.getByRole("button", { name: "Publish Disclosure" }).click();
    await page.getByLabel("Trade Count").fill("5");
    await page.getByLabel("Total Gross Notional ($)").fill("10000000");
    await page.getByRole("button", { name: "Publish Report" }).click();
    await expect(page.getByText("published")).toBeVisible();
  });
});
