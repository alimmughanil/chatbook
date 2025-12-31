import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationDir = path.resolve(__dirname, '../../database/migrations');

const getTodayDatePrefix = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}_${month}_${day}`;
};

const renameMigrations = () => {
  try {
    if (!fs.existsSync(migrationDir)) {
      console.error(`❌ Error: Direktori tidak ditemukan di: ${migrationDir}`);
      return;
    }

    const files = fs.readdirSync(migrationDir);

    const migrationFiles = files
      .filter(file => file.endsWith('.php'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log("⚠️ Tidak ada file migration (.php) yang ditemukan.");
      return;
    }

    const datePrefix = getTodayDatePrefix();
    let counter = 1;

    console.log(`📂 Memproses ${migrationFiles.length} file migration...`);
    console.log(`📅 Target Tanggal: ${datePrefix}`);
    console.log('---');

    migrationFiles.forEach(file => {
      const match = file.match(/^\d{4}_\d{2}_\d{2}_\d{6}_(.+)$/);

      let originalNameSuffix = file;

      if (match) {
        originalNameSuffix = match[1];
      } else {
        console.warn(`⚠️ Format file tidak standar: ${file}, tetap diproses.`);
      }

      const sequence = String(counter).padStart(6, '0');
      const newFileName = `${datePrefix}_${sequence}_${originalNameSuffix}`;

      const oldPath = path.join(migrationDir, file);
      const newPath = path.join(migrationDir, newFileName);
      fs.renameSync(oldPath, newPath);

      console.log(`✅ Renamed: ${file} \n   ➜ ${newFileName}`);

      counter++;
    });

    console.log('---');
    console.log('🎉 Selesai! Semua migration berhasil di-rename.');

  } catch (error) {
    console.error('❌ Terjadi kesalahan:', error.message);
  }
};

renameMigrations();