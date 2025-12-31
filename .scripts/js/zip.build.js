import fs from 'fs';
import archiver from 'archiver';

const output = fs.createWriteStream('public/build.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => console.log(`Zip selesai: ${archive.pointer()} bytes`));
archive.on('error', err => { throw err; });

archive.pipe(output);
archive.directory('public/build/', 'build');
archive.finalize();
