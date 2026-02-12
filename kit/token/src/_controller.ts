import type {PrincipalText} from '@dfinity/zod-schemas';
import {Ed25519KeyIdentity, type JsonnableEd25519KeyIdentity} from '@icp-sdk/core/identity';
import {deleteSatelliteControllers} from '@junobuild/admin';

export const deleteController = async ({
  token,
  satelliteId
}: {
  token: JsonnableEd25519KeyIdentity;
  satelliteId: PrincipalText;
}) => {
  const identity = Ed25519KeyIdentity.fromParsedJson(token);

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
};
