import { chromium } from "playwright";

const errors = [];
const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });

await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(3000);

const total = await page.evaluate(() => document.documentElement.scrollHeight);
const vh = 900;
// walk down the page capturing each stop
const shots = [
  ["story", 1.05], ["work-pin", 1.7], ["work-slide", 2.6], ["infra", 3.7], ["clients", 4.7], ["skills", 5.6], ["contact", 6.6],
];
let n = 0;
for (const [label, mult] of shots) {
  await page.evaluate((y) => window.scrollTo(0, y), vh * mult);
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `v-${n}-${label}.png` });
  n++;
}
console.log("SCROLLHEIGHT:", total);
console.log("ERRORS:", errors.length ? "\n" + errors.join("\n") : "none");
await browser.close();
