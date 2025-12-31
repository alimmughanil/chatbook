import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const lockPath = resolve('composer.lock');
const jsonPath = resolve('composer.json');

const lockData = JSON.parse(await readFile(lockPath, 'utf8'));
const composerJson = JSON.parse(await readFile(jsonPath, 'utf8'));

// Helper: konversi versi "v12.1.0" → "^12.1"
function toCaretVersion(version) {
  const match = version.match(/^v?(\d+)\.(\d+)/);
  return match ? `^${match[1]}.${match[2]}` : null;
}

// Gabungkan semua package: prod + dev
const allPackages = [...lockData.packages, ...lockData['packages-dev']];

const changes = [];

for (const pkg of allPackages) {
  const name = pkg.name;
  const lockedVersion = pkg.version;
  const caretVersion = toCaretVersion(lockedVersion);
  if (!caretVersion) continue;

  if (composerJson.require?.[name]) {
    composerJson.require[name] = caretVersion;
    changes.push({ name, caretVersion });
  }

  if (composerJson['require-dev']?.[name]) {
    composerJson['require-dev'][name] = caretVersion;
    changes.push({ name, caretVersion, dev: true });
  }
}

await writeFile(jsonPath, JSON.stringify(composerJson, null, 4));

console.log(`✅ composer.json updated with locked versions:\n`);
for (const c of changes) {
  console.log(`- ${c.dev ? '[dev] ' : ''}${c.name} => ${c.caretVersion}`);
}
