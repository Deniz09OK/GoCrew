// Configuration Playwright de base
// Documentation : https://playwright.dev/docs/test-configuration

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    testDir: './tests/e2e',
    timeout: 30000,
    retries: 0,
    use: {
        baseURL: 'http://localhost:5173',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
    },
};

module.exports = config;
