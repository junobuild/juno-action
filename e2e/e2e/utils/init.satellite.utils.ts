import {assertNonNullish} from '@dfinity/utils';
import {test} from '@playwright/test';
import {CliPage} from '../page-objects/cli.page';
import {readConfig} from './config.utils';

interface SatelliteTestPages {
  satelliteId: string;
  cliPage: CliPage;
}

export const initSatelliteTestSuite = (): (() => SatelliteTestPages) => {
  let satelliteId: string;
  let cliPage: CliPage;

  test.beforeAll(async () => {
    const config = await readConfig({mode: 'development'});

    if ('err' in config) {
      throw new Error('Failed to read config');
    }

    const {ok: okConfig} = config;
    const id = okConfig.satellite.ids?.['development'];

    assertNonNullish(id);

    satelliteId = id;

    cliPage = await CliPage.initWithoutLogin({satelliteId});
  });

  test.afterAll(async () => {
    await cliPage.revertConfig();
  });

  return (): SatelliteTestPages => ({satelliteId, cliPage});
};
