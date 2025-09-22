
/**
 * Singleton utility to track custom events on a page (chat or merchant apps).
 * Useful for Playwright tests to wait for specific events or verify event flow.
 */

interface EventDetail {
  url?: string;
  time?: number;
  [key: string]: any;
}

interface CapturedEvent {
  resolved: boolean;
  resolvedTime: number;
  event: CustomEvent<EventDetail>;
}

interface EventCheckOptions {
  testId?: string;
  after?: number;
  timeout?: number;
}

export const EventNames = {
  APP_INITIALIZED: 'EVENT_APP_INITIALIZED',
  CALL_MERCHANT_APP: 'EVENT_CALL_MERCHANT_APP',
  MOUNTING_MERCHANT_APP: 'EVENT_MOUNTING_MERCHANT_APP',
  CHAT_FACTORY_INITIALIZED: 'EVENT_CHAT_FACTORY_INITIALIZED',
  FLOATING_CHAT_RENDERING: 'EVENT_FLOATING_CHAT_RENDERING',
  FLOATING_CHAT_NOT_RENDERING: 'EVENT_FLOATING_CHAT_NOT_RENDERING',
  FLOATING_CHAT_BUTTON_RENDERING: 'EVENT_FLOATING_CHAT_BUTTON_RENDERING',
  SHADOW_DOM_CONTAINER_READY: 'EVENT_SHADOW_DOM_CONTAINER_READY',
};

export class EventTrackerHelper {
  private static _instance: EventTrackerHelper;
  private capturedEvents: Record<string, CapturedEvent[]> = {};
  private currentUrl: string;

  private boundHandleEvents: (event: Event) => void;
  private boundHistoryListener: (event: Event) => void;

  private constructor() {
    this.currentUrl = this.getCurrentUrl();
    this.boundHandleEvents = this.handleEvents.bind(this);
    this.boundHistoryListener = this.historyListener.bind(this);

    this.initListeners();
  }

  // Get singleton instance 
  public static getInstance(): EventTrackerHelper {
    if (!EventTrackerHelper._instance) {
      EventTrackerHelper._instance = new EventTrackerHelper();
    }
    return EventTrackerHelper._instance;
  }

  // Initialize event listeners 
  private initListeners() {
    Object.values(EventNames).forEach((eventName) => {
      window.addEventListener(eventName, this.boundHandleEvents);
    });
    window.addEventListener('popstate', this.boundHistoryListener);
  }

  // Reset all captured events 
  public reset() {
    this.capturedEvents = {};
    this.currentUrl = this.getCurrentUrl();
  }

  // Destroy listeners 
  public destroy() {
    this.reset();
    Object.values(EventNames).forEach((eventName) => {
      window.removeEventListener(eventName, this.boundHandleEvents);
    });
    window.removeEventListener('popstate', this.boundHistoryListener);
  }

  // Handle incoming custom events 
  private handleEvents(event: Event) {
    const customEvent = event as CustomEvent<EventDetail>;
    const eventUrl = this.formatUrl(customEvent.detail?.url);
    if (this.getCurrentUrl() !== eventUrl) return;

    this.setEventTime(customEvent);

    if (!this.capturedEvents[event.type]) {
      this.capturedEvents[event.type] = [];
    }

    this.capturedEvents[event.type].push({
      resolved: false,
      resolvedTime: -1,
      event: customEvent,
    });
  }

  // Ensure event has a timestamp 
  private setEventTime(event: CustomEvent<EventDetail>) {
    if (!event.detail.time) {
      event.detail.time = Date.now();
    }
  }

  // Check if an event occurred, with optional filters 
  public checkForEvent(eventType: string, opts: EventCheckOptions = {}) {
    const events = this.capturedEvents[eventType];
    if (!events) return;

    const filtered = events.filter((e) => {
      if (e.resolved) return false;
      if (opts.testId && e.event.detail['data-testid'] !== opts.testId) return false;
      if (opts.after && e.event.detail.time! < opts.after) return false;
      return true;
    });

    return filtered.length ? filtered[0] : undefined;
  }

  // Wait for a specific event to occur, with timeout 
  public waitForEvent(eventType: string, opts: EventCheckOptions = {}): Promise<CustomEvent<EventDetail>> {
    opts.timeout = opts.timeout || 30000;
    const start = Date.now();

    return new Promise((resolve, reject) => {
      const resolveEvent = (captured: CapturedEvent) => {
        captured.resolved = true;
        captured.resolvedTime = Date.now();
        resolve(captured.event);
      };

      const found = this.checkForEvent(eventType, opts);
      if (found) return resolveEvent(found);

      const intervalId = setInterval(() => {
        if (Date.now() - start > opts.timeout!) {
          clearInterval(intervalId);
          return reject(new Error(`${eventType} ${opts.testId ? `with data-testid=${opts.testId}` : ''} not fired within ${opts.timeout}ms`));
        }
        const ev = this.checkForEvent(eventType, opts);
        if (ev) {
          clearInterval(intervalId);
          return resolveEvent(ev);
        }
      }, 50);
    });
  }

  // Reset events if URL changes 
  private historyListener(_event: Event) {
    try {
      const url = this.formatUrl(window.location.href);
      if (url !== this.currentUrl) this.reset();
    } catch (e) {
      console.warn('History listener error ignored', e);
    }
  }

  // Normalize URL (remove query and hash) 
  private formatUrl(url?: string) {
    url = url || window.location.href;
    return url.split('?')[0].split('#')[0];
  }

  // Get current URL normalized 
  private getCurrentUrl() {
    return this.formatUrl(window.location.href);
  }
}

// Attach singleton to window for Playwright / browser access
if (!(window as any)._event_tracker) {
  (window as any)._event_tracker = {
    tracker: EventTrackerHelper.getInstance(),
  };
}
