import type {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import {deleteSatelliteControllers} from '@junobuild/admin';
import type {Env} from './_env';

export const deleteController = async ({
  identity,
  env: {satelliteId, container}
}: {
  identity: Ed25519KeyIdentity;
  env: Pick<Env, 'satelliteId' | 'container'>;
}): Promise<{result: 'success'} | {result: 'error'; err: unknown}> => {
  try {
    await deleteSatelliteControllers({
      args: {
        controllers: [identity.getPrincipal()]
      },
      satellite: {
        identity,
        container,
        satelliteId
      }
    });

    return {result: 'success'};
  } catch (err: unknown) {
    return {result: 'error', err};
  }
};
