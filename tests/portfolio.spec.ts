import { expect, test } from "@playwright/test";

test("project details, accessible skill tabs, and contact brief work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page).toHaveTitle(/Dinul Iman/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Complex logic.",
  );
  await page
    .getByRole("button", { name: "Lihat detail Payroll PELNI" })
    .click();
  const project = page.getByRole("dialog", { name: "Payroll PELNI" });
  await expect(project).toBeVisible();
  await expect(project).toContainText("PPh 21 TER");
  await page.keyboard.press("Escape");
  await expect(project).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Lihat detail Payroll PELNI" }),
  ).toBeFocused();
  await page.getByRole("tab", { name: /Data & reporting/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText("JasperReports");
  await expect(page.getByRole("tabpanel")).not.toContainText("Laravel");
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("tab", { name: /Tools & workflow/ }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Codex");
  await page.getByRole("button", { name: "Mulai percakapan" }).click();
  await page.getByLabel("Nama", { exact: true }).fill("Pengunjung");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await page
    .getByLabel("Apa yang ingin kamu bangun?")
    .fill("Mari diskusi tentang backend payroll.");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Simpan brief proyek" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("brief-untuk-dinul.txt");
  await expect(
    page
      .getByRole("dialog", { name: "Mulai percakapan dengan Dinul Iman" })
      .getByRole("status"),
  ).toContainText("Belum ada pesan yang dikirim");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Mulai percakapan dengan Dinul Iman" }),
  ).not.toBeVisible();
});

test("mobile navigation and layout fit the screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Buka menu" }).click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page.getByRole("link", { name: "Keahlian", exact: true }).click();
  await expect(page.getByRole("navigation")).not.toBeVisible();
  await expect(page).toHaveURL(/#stack$/);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  const overflowingElements = await page
    .locator("body *")
    .evaluateAll((elements) =>
      elements
        .filter((element) => {
          const bounds = element.getBoundingClientRect();
          return (
            bounds.width > 0 &&
            (bounds.right > window.innerWidth + 1 || bounds.left < -1)
          );
        })
        .map((element) => ({
          tag: element.tagName,
          class: element.className,
          width: element.getBoundingClientRect().width,
          right: element.getBoundingClientRect().right,
        })),
    );
  expect(overflow, JSON.stringify(overflowingElements)).toBe(false);
  await page
    .getByRole("button", { name: "Lihat detail Data, connected." })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Data, connected." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Tutup dialog", exact: true }).click();
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `Page overflow at ${width}px`,
    ).toBe(width);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});

test("Spline failure keeps the portfolio usable and can be retried", async ({
  page,
}) => {
  await page.route("https://prod.spline.design/**", (route) => route.abort());
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Coba muat ulang scene 3D" }),
  ).toBeVisible({ timeout: 35000 });
  await expect(page.locator(".scene-fallback")).toHaveCSS("opacity", "1");
  await page.getByRole("button", { name: "Coba muat ulang scene 3D" }).click();
  await expect(
    page.getByRole("button", { name: "Coba muat ulang scene 3D" }),
  ).toBeVisible({ timeout: 35000 });
  await expect(
    page.getByRole("link", { name: "Explore my work" }),
  ).toBeVisible();
});

test("live Spline scene loads and can be paused", async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.goto("/");
  await expect(page.locator(".scene-stage")).toHaveClass(/scene-ready/, {
    timeout: 35000,
  });
  await expect(page.locator(".spline-layer canvas")).toBeVisible();
  const modes = page.getByRole("group", { name: "Mode laboratorium" });
  await modes.getByRole("button", { name: "Data", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Connected by data" }),
  ).toBeVisible();
  await expect(page.locator(".scene-lab")).toHaveAttribute("data-mode", "data");
  await page.getByRole("button", { name: "Perbesar model 3D" }).click();
  await expect(page.getByLabel("Tingkat zoom")).toHaveText("110%");
  await page.getByRole("button", { name: "Putar robot 360 derajat" }).click();
  await expect(
    page.getByRole("button", { name: "Putar robot 360 derajat" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Jeda animasi 3D" }).click();
  await expect(page.locator(".scene-stage")).toHaveClass(/scene-paused/);
  await expect(page.locator(".orbital-track").first()).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await page.getByRole("button", { name: "Aktifkan animasi 3D" }).click();
  await expect(page.locator(".scene-stage")).not.toHaveClass(/scene-paused/);
  await page.getByRole("button", { name: "Pindai hologram" }).click();
  await expect(page.locator(".scene-stage")).toHaveClass(/is-scanning/);
  await page.getByRole("button", { name: "Reset tampilan 3D" }).click();
  await expect(page.getByLabel("Tingkat zoom")).toHaveText("100%");
  await expect(page.locator(".scene-lab")).toHaveAttribute("data-mode", "core");
  await expect(
    page.getByRole("button", { name: "Putar robot 360 derajat" }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  await page.screenshot({ path: "test-results/desktop-hero.png" });
  await modes.getByRole("button", { name: "AI", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Curiosity, amplified" }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/lab-ai.png" });
  await page.getByRole("button", { name: "Buka 3D layar penuh" }).click();
  await expect(page.locator(".scene-lab")).toHaveJSProperty(
    "offsetWidth",
    1440,
  );
  await expect(
    page.getByRole("button", { name: "Keluar layar penuh 3D" }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/lab-fullscreen.png" });
  await page.getByRole("button", { name: "Keluar layar penuh 3D" }).click();
  await expect(
    page.getByRole("button", { name: "Buka 3D layar penuh" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".spline-layer canvas")).toBeVisible();
  await page.screenshot({
    path: "test-results/mobile-live.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("reduced motion keeps the lab static and its hotspots usable without WebGL", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".spline-layer canvas")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Aktifkan animasi 3D" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Jelajahi Connected by data" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Connected by data" }),
  ).toBeVisible();
  await expect(page.locator(".orbital-track").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(
    page.getByRole("button", { name: "Perbesar model 3D" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Reset tampilan 3D" }).click();
  await expect(
    page.getByRole("heading", { name: "Backend engineering", exact: true }),
  ).toBeVisible();
});
