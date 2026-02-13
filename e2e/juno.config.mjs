import { defineConfig } from "@junobuild/config";

/** @type {import('@junobuild/config').JunoConfig} */
export default defineConfig({
  satellite: {
    ids: {
      development: "jx5yt-yyaaa-aaaal-abzbq-cai",
      production: "<PROD_SATELLITE_ID>",
    },
    source: "fixtures",
  },
  emulator: {
    runner: {
      type: "docker",
    },
    satellite: {},
  },
});
