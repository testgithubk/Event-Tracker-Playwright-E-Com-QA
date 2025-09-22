import { test, expect } from '../utils/fixtures';
import { merchantsList } from '../utils/merchants';
import { EventNames } from '../utils/event-tracker-helper';

async function waitForEventFromTracker(
  eventTracker: any,
  eventName: string,
  timeout = 15000,
  maxRetries = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt}/${maxRetries} - Waiting for event "${eventName}" with timeout ${timeout}ms`);

    try {
      await eventTracker.waitForEvent(eventName, { timeout });
      console.log(`Event "${eventName}" received.`);
      return true;
    } catch (e) {
      console.warn(`Event "${eventName}" not received. Retrying...`, e);
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  console.error(`Failed to receive event "${eventName}" after ${maxRetries} attempts.`);
  return false;
}

test.describe('Event Tracker Tests', () => {
  for (let index = 0; index < merchantsList.length; index++) {
    const { merchant, url } = merchantsList[index];

    test(`(${index + 1}) Verify events on merchant: ${merchant}`, async ({ visitMerchantPage, eventTracker }) => {
      console.log(`\nTesting merchant: ${merchant}`);
      await visitMerchantPage(merchant); 
      console.log(`Visited merchant URL: ${url}`);

      // Check APP_INITIALIZED event
      const appInitEvent = await waitForEventFromTracker(eventTracker, EventNames.APP_INITIALIZED, 15000);
      expect(appInitEvent).toBeTruthy();

      // Check SHADOW_DOM_CONTAINER_READY event
      const shadowDomEvent = await waitForEventFromTracker(eventTracker, EventNames.SHADOW_DOM_CONTAINER_READY, 15000);
      expect(shadowDomEvent).toBeTruthy();

      console.log(`All required events received for ${merchant}`);
    });
  }
});

