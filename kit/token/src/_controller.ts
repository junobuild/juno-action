import type {PrincipalText} from '@dfinity/zod-schemas';
import {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import {deleteSatelliteControllers} from '@junobuild/admin';

export const deleteController = async ({
  identity,
  satelliteId
}: {
  identity: Ed25519KeyIdentity;
  satelliteId: PrincipalText;
}): Promise<{result: 'success'} | {result: 'error'; err: unknown}> => {
  try {
    await deleteSatelliteControllers({
      args: {
        controllers: [identity.getPrincipal()]
      },
      satellite: {
        identity,
        container: false,
        satelliteId
      }
    });

    return {result: 'success'};
  } catch (err: unknown) {
    return {result: 'error', err};
  }
};
