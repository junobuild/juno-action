import type {JsonnableEd25519KeyIdentity} from '@icp-sdk/core/identity';

export const encodeToken = (token: JsonnableEd25519KeyIdentity): string =>
  btoa(JSON.stringify({token}));

export const decodeToken = (
  envToken: string
): {token: JsonnableEd25519KeyIdentity} | {err: unknown} => {
  try {
    return JSON.parse(atob(envToken));
  } catch (err: unknown) {
    return {err};
  }
};
