import type {PrincipalText} from '@dfinity/zod-schemas';
import type {JunoConfigEnv, SatelliteConfig} from '@junobuild/config';

interface SatelliteConfigEnv {
  satellite: SatelliteConfig;
  env: JunoConfigEnv;
}

export const assertAndReadSatelliteId = ({
  satellite,
  env: {mode}
}: SatelliteConfigEnv): {satelliteId: PrincipalText | undefined} => {
  const {id, ids} = satellite;

  // Originally, the config used `satelliteId`, but we later migrated to `id` and `ids`.
  // We kept `satelliteId` in the configuration types for a while, but it is now deprecated there as well.
  // For backwards compatibility, we still read it here.
  const deprecatedSatelliteId =
    'satelliteId' in satellite
      ? (satellite as unknown as {satelliteId: PrincipalText}).satelliteId
      : undefined;

  const satelliteId = ids?.[mode] ?? id ?? deprecatedSatelliteId;

  // TODO: Principal.isPrincipal

  return {satelliteId};
};
