import type {JsonnableEd25519KeyIdentity} from '@icp-sdk/core/identity';
import {Principal} from '@icp-sdk/core/principal';
import {authenticateAutomation} from '@junobuild/auth/automation';
import {Env} from './_env';

export const authenticate = async ({
  oidcRequest: {url: requestUrl, token: requestToken},
  satelliteId,
  container
}: Env): Promise<
  | {result: 'success'; id: Principal; token: JsonnableEd25519KeyIdentity}
  | {result: 'error'; err: unknown}
> => {
  // Request the OIDC token from GitHub
  const generateJwt = async ({nonce}: {nonce: string}) => {
    const response = await fetch(`${requestUrl}&audience=${nonce}`, {
      headers: {
        Authorization: `Bearer ${requestToken}`,
        Accept: 'application/json; api-version=2.0',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Could not retrieve token');
    }

    const {value: oidcToken} = await response.json();
    return {jwt: oidcToken};
  };

  try {
    const {identity} = await authenticateAutomation({
      github: {
        credentials: {
          generateJwt
        },
        automation: {
          satellite: {
            container,
            satelliteId
          }
        }
      }
    });

    return {
      result: 'success',
      token: identity.toJSON(),
      id: identity.getPrincipal()
    };
  } catch (err: unknown) {
    return {result: 'error', err};
  }
};
