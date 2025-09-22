import { test as base, Page } from '@playwright/test';
import * as fs from 'fs';
import { merchantsList, OrgShortName } from './merchants';

// Injectable JS helper for event tracking (must be compiled JS)
const helperScript = fs.readFileSync('./utils/event-tracker-helper.js', 'utf8');

type TrackerFixtures = {
  trackedPage: Page; // Page with EventTrackerHelper injected
  visitMerchantPage: (merchant: OrgShortName) => Promise<void>;
  eventTracker: any; // EventTrackerHelper instance from page context
};

export const test = base.extend<TrackerFixtures>({
  trackedPage: async ({ page }, use) => {
    // Inject tracker before page scripts run
    await page.addInitScript(helperScript);
    await use(page);
  },

  visitMerchantPage: async ({ trackedPage }, use) => {
    const visit = async (merchant: OrgShortName) => {
      // Navigate to the first URL of the selected merchant
      const merchantData = merchantsList.find((m) => m.merchant === merchant);
      if (!merchantData) throw new Error(`No URL found for merchant: ${merchant}`);
      await trackedPage.goto(merchantData.url, { waitUntil: 'domcontentloaded' });
    };
    await use(visit);
  },

  eventTracker: async ({ trackedPage }, use) => {
    // Access EventTrackerHelper instance in browser
    const trackerHandle = await trackedPage.evaluateHandle(() => (window as any)._event_tracker.tracker);
    await use(trackerHandle);
  },
});

export { expect } from '@playwright/test';
