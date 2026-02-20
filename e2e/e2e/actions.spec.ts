import {assertNonNullish} from '@dfinity/utils';
import {expect, test} from '@playwright/test';
import {readConfig} from './utils/config.utils';

test('should have deployed', async ({page}) => {
  const config = await readConfig({mode: 'development'});

  if ('err' in config) {
    expect(true).toBeFalsy();
    return;
  }

  const {ok: okConfig} = config;

  const satelliteId = okConfig.satellite.ids?.['development'];
  assertNonNullish(satelliteId);

  await page.goto(`http://${satelliteId}.localhost:5987`);

  await expect(page.locator('body')).toContainText('Hello World');
});
