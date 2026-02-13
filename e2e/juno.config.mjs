import { defineConfig } from "@junobuild/config";

/** @type {import('@junobuild/config').JunoConfig} */
export default defineConfig({
  satellite: {
    ids: {
      development: "jx5yt-yyaaa-aaaal-abzbq-cai",
      production: "yzqgl-jiaaa-aaaal-asq4q-cai",
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
