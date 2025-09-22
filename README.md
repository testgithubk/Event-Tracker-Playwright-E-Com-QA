<<<<<<< HEAD
# Event-Tracker-Playwright-E-Com-QA
Playwright project for tracking custom events across e-commerce merchant pages using EventTrackerHelper.
=======
# Event Tracker – Playwright E-Commerce QA

A sample **Playwright** project demonstrating **event tracking across multiple merchant pages** using a custom **EventTrackerHelper**. Ideal for QA testing of e-commerce platforms to verify app initialization and shadow DOM container readiness events.


## Features

- Tracks custom events on multiple merchant pages.
- Works with demo e-commerce sites like **FakeStore**, **SauceDemo**, **OpenCart**, and more.
- Waits for and verifies events such as `EVENT_APP_INITIALIZED` and `EVENT_SHADOW_DOM_CONTAINER_READY`.
- Easily extendable to add more events or merchants.
- Written in **TypeScript** for type safety.


## Project Structure
Event-Tracker-playwright E-com QA/
│
├─ utils/
│ ├─ event-tracker-helper.ts # Event tracking utility
│ ├─ merchants.ts # Merchant URLs and metadata
│ └─ fixtures.ts # Playwright fixtures
│
├─ tests/
│ └─ event-tracker.spec.ts # Sample tests 

├─ package.json # Node project config
├─ tsconfig.json # TypeScript config
└─ README.md # Project overview

## Installation

1. Clone the repository:
git clone <repository_url>.git

2. Install dependencies:
npm install

3. Build TypeScript (if needed):
npx tsc

## Running Tests

Run all tests:
npx playwright test

Run a specific test file:
npx playwright test tests/event-tracker-helper.ts

Run with HTML reporter:
npx playwright test --reporter=html

## Usage

Each test navigates to a merchant page using the visitMerchantPage fixture.

EventTrackerHelper listens for predefined events and allows waiting for events using waitForEvent.

Extend the merchantsList to add more merchants.

Events are defined in EventNames inside event-tracker-helper.ts.

## Extending the Project

Add new events: Add event names in EventNames and track them in tests.

Add new merchants: Add merchant URLs in merchants.ts.

Add custom assertions: Use waitForEventFromTracker helper to wait for events and assert conditions.

## Technologies Used

Playwright
 – End-to-end testing framework

TypeScript – Typed JavaScript

Node.js – Runtime environment

## License
This project is open-source and available for demonstration and educational purposes.
>>>>>>> 8c9c5e5 (Playwright Sample Files)
