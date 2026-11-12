import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';

export async function packageGame(input = 'dist', output = 'artifacts/game.zip') {
  const root = resolve(input);
  const files = {};
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile()) files[relative(root, path).replaceAll('\\', '/')] = new Uint8Array(await readFile(path));
      else throw new Error(`Unsupported build entry: ${path}`);
    }
  }
  await walk(root);
  if (!files['index.html']) throw new Error('Build must contain index.html at the ZIP root. Run npm run build first.');
  await mkdir(resolve(output, '..'), { recursive: true });
  await writeFile(output, zipSync(files, { level: 6 }));
  return { output, files: Object.keys(files) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await packageGame();
  console.log(`${result.output}: ${result.files.length} files, ready for itch.io upload.`);
}
