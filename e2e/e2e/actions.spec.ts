import {initSatelliteSuite} from '@junobuild/emulator-playwright';
import {expect, test} from '@playwright/test';

test.describe.configure({mode: 'serial'});

test.describe('Deploy', () => {
  const getTestPages = initSatelliteSuite();

  test.afterAll(async () => {
    const {cliPage} = getTestPages();
    await cliPage.cleanUp();
  });

  test('should have deployed', async ({page}) => {
    const {satelliteId} = getTestPages();

    await page.goto(`http://${satelliteId}.localhost:5987`);

    await expect(page.locator('body')).toContainText('Hello World');
  });
});
