import { getBrowser } from "../browsers/playwright.js";

async function scrapeIndeedJob(url) {
  const browser = await getBrowser();

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  await page.goto(url, {
    waitUntil: "networkidle",
  });

  const data = await page.evaluate(() => {
    const getText = (sel) => document.querySelector(sel)?.innerText?.trim() || null;
    const salaryContainer = document.querySelector("#salaryInfoAndJobType");
    const salarySpans = salaryContainer?.querySelectorAll("span") || [];

    return {
      title: getText("h1"),
      company: getText('[data-testid="inlineHeader-companyName"]'),
      location: getText('[data-testid="inlineHeader-companyLocation"]'),
      description: getText("#jobDescriptionText"),
      salary: salarySpans[0]?.innerText?.trim() || null,
      employment_type: salarySpans[1]?.innerText?.replace(/^\s*-\s*/, "")?.trim() || null,
      work_type: (() => {
        const locationEl = document.querySelector('[data-testid="inlineHeader-companyLocation"]');
        const raw = locationEl?.nextElementSibling?.innerText?.trim() || null;
        if (!raw) return null;
        if (raw.toLowerCase().includes("remote")) return "Remote";
        if (raw.toLowerCase().includes("hybrid")) return "Hybrid";
        if (raw.toLowerCase().includes("on-site")) return "On-site";
        return raw;
      })(),
    };
  });

  console.log("SCRAPED DATA:", data);
  await page.close();
  await context.close();

  return {
    ...data,
    url,
  };
}

export { scrapeIndeedJob };
