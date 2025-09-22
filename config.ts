import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file
dotenv.config({ path: '.env' });

// Validate environment variables
const envSchema = z.object({
  STEEL_API_KEY: z.string().min(1, "STEEL_API_KEY is required"),
  PLAYWRIGHT_BASE_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('test'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid or missing environment variables:", parsed.error.format());
  process.exit(1);
}

const env = parsed.data;

export default defineConfig({
  testDir: './tests',
  timeout: 120 * 1000,

  expect: {
    timeout: 12_000,
    toHaveScreenshot: { maxDiffPixels: 10 },
    toMatchSnapshot: { maxDiffPixelRatio: 0.1 },
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results.xml' }],
  ],

  outputDir: 'test-results/',
  testIgnore: '*test-assets',

  use: {
    baseURL: env.PLAYWRIGHT_BASE_URL,
    trace: 'on-first-retry',
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 720 },
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
