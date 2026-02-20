import {initEmulatorSuite} from '@junobuild/emulator-playwright';
import {test} from '@playwright/test';

test.describe.configure({mode: 'serial'});

test.describe('Init', () => {
  const getTestPages = initEmulatorSuite({satelliteKind: 'website'});

  test('should have initialized a satellite', async () => {
    const {consolePage} = getTestPages();

    const satellitePage = await consolePage.visitSatelliteSite({
      title: 'Juno / Satellite'
    });

    await satellitePage.assertContainText('Welcome to Juno');
  });
});
