import {test} from '@playwright/test';
import {initTestSuite} from './utils/init.utils';

test.describe.configure({mode: 'serial'});

test.describe('Init', () => {
  const getTestPages = initTestSuite();

  test('should have initialized a satellite', async () => {
    const {consolePage} = getTestPages();

    const satellitePage = await consolePage.visitSatelliteSite({
      title: 'Juno / Satellite'
    });

    await satellitePage.assertContainsText('Welcome to Juno');
  });
});
