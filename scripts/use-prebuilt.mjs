import { readFile, writeFile } from 'node:fs/promises';

const image = process.argv[2];
if (!image || !/^ghcr\.io\/[a-z0-9_.-]+\/[a-z0-9_.-]+(?::[a-zA-Z0-9_.-]+|@sha256:[a-f0-9]{64})$/.test(image)) {
  throw new Error('Usage: node scripts/use-prebuilt.mjs ghcr.io/OWNER/vibecda-dev:COMMIT');
}
const path = '.devcontainer/devcontainer.json';
const config = JSON.parse(await readFile(path, 'utf8'));
delete config.build;
config.image = image;
await writeFile(path, `${JSON.stringify(config, null, 2)}\n`);
console.log('Updated devcontainer. Confirm the image is public and test from a participant account before launch.');
