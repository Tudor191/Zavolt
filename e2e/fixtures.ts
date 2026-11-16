import { test as base, expect } from '@playwright/test';

interface Fixtures {
  /**
   * Everything the browser reported as going wrong while the test ran: console
   * errors and warnings (which include Content-Security-Policy violations and
   * failed resource loads) and uncaught exceptions.
   *
   * Every test fails if this is not empty at the end. A test that provokes a
   * problem on purpose must assert on it and then empty the list.
   */
  readonly problems: string[];
}

export const test = base.extend<Fixtures>({
  problems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error' || message.type() === 'warning') {
          problems.push(`console ${message.type()}: ${message.text()}`);
        }
      });
      page.on('pageerror', (error) => {
        problems.push(`uncaught: ${error.message}`);
      });

      await use(problems);

      expect(problems, 'the browser reported no errors or warnings').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
