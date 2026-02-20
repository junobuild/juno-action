import {expect, test} from '@playwright/test';
import {initSatelliteTestSuite} from './utils/init.satellite.utils';

test.describe.configure({mode: 'serial'});

test.describe('Deploy', () => {
  const getTestPages = initSatelliteTestSuite();

  test.afterAll(async () => {
    const {cliPage} = getTestPages();
    await cliPage.revertConfig();
  });

  test('should have deployed', async ({page}) => {
    const {satelliteId} = getTestPages();

    await page.goto(`http://${satelliteId}.localhost:5987`);

    await expect(page.locator('body')).toContainText('Hello World');
  });
});
