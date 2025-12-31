import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Baca package.json
const packageJsonPath = path.resolve('package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Ambil dependencies dan devDependencies
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

// Daftar untuk menyimpan perubahan yang dilakukan
const updated = [];

// Hapus duplikasi: Jika paket ada di devDependencies dan dependencies, hapus dari salah satunya
for (const name in dependencies) {
  if (devDependencies[name]) {
    console.log(`⚠️ Ditemukan duplikasi: ${name}. Akan dipindahkan ke devDependencies.`);
    delete dependencies[name];
  }
}

// Mengupdate dependencies
for (const [name, version] of Object.entries(dependencies)) {
  const majorMinor = version.split('.').slice(0, 2).join('.');
  const caretVersion = `^${majorMinor}`;

  try {
    execSync(`npm pkg set dependencies.${name}="${caretVersion}"`, { stdio: 'ignore' });
    updated.push({ name, caretVersion });
  } catch {
    console.warn(`⚠️ Gagal update ${name}`);
  }
}

// Mengupdate devDependencies
for (const [name, version] of Object.entries(devDependencies)) {
  const majorMinor = version.split('.').slice(0, 2).join('.');
  const caretVersion = `^${majorMinor}`;

  try {
    execSync(`npm pkg set devDependencies.${name}="${caretVersion}"`, { stdio: 'ignore' });
    updated.push({ name, caretVersion, dev: true });
  } catch {
    console.warn(`⚠️ Gagal update ${name}`);
  }
}

// Menulis perubahan kembali ke package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('\n✅ package.json updated with locked versions:\n');
for (const u of updated) {
  console.log(`- ${u.dev ? '[dev] ' : ''}${u.name} => ${u.caretVersion}`);
}
