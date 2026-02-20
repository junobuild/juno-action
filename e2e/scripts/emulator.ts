// Enable the Observatory for fetching GitHub JWKs and set rate config
await fetch(
  'http://localhost:5999/observatory/monitoring/openid/?action=start&provider=gh_actions'
);
