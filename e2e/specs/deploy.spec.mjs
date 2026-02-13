import { test } from "node:test";
import assert from "node:assert";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

test("deployment succeeded", async () => {
  const response = await fetch(
    "http://jx5yt-yyaaa-aaaal-abzbq-cai.localhost:5987",
  );
  assert.ok(response.ok);

  const deployedContent = await response.text();

  const expectedContent = await readFile(
    join(process.cwd(), "fixtures", "index.html"),
    "utf-8",
  );

  assert.strictEqual(deployedContent, expectedContent);
});
