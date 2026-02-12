import type {JsonnableEd25519KeyIdentity} from '@icp-sdk/core/identity';
import {authenticateAutomation} from '@junobuild/auth/automation';
import {PrincipalText} from '@dfinity/zod-schemas';

export const authenticate = async ({
  oidcRequest: {url: requestUrl, token: requestToken},
  satelliteId
}: {
  oidcRequest: {
    url: string;
    token: string;
  };
  satelliteId: PrincipalText;
}): Promise<
  {result: 'success'; token: JsonnableEd25519KeyIdentity} | {result: 'error'; err: unknown}
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
            container: false,
            satelliteId
          }
        }
      }
    });

    return {
      result: 'success',
      token: identity.toJSON()
    };
  } catch (err: unknown) {
    return {result: 'error', err};
  }
};
