import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Konfigurasi Path ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input: Folder Migrations
const migrationDir = path.resolve(__dirname, '../../database/migrations');
// Output: File JSON
const outputDir = path.resolve(__dirname, '../../resources/json');
const outputFile = path.join(outputDir, 'migrations.json');

// --- Helper: Format Label (Snake Case ke Title Case / Indonesia Custom) ---
const formatLabel = (columnName) => {
    const dictionary = {};
    if (dictionary[columnName]) {
        return dictionary[columnName];
    }

    // Default: ubah "user_id" menjadi "User Id"
    return columnName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
};

// --- Fungsi Parsing Konten File Migration ---
const parseMigrationContent = (content) => {
    const columns = [];
    let tableName = 'unknown_table';

    // 1. Cari Nama Tabel (Schema::create('nama_tabel', ...))
    const tableMatch = content.match(/Schema::create\(['"](.+?)['"]/);
    if (tableMatch) {
        tableName = tableMatch[1];
    } else {
        // Coba cari Schema::table jika bukan create
        const tableAlterMatch = content.match(/Schema::table\(['"](.+?)['"]/);
        if (tableAlterMatch) tableName = tableAlterMatch[1];
    }

    // 2. Baca baris per baris untuk mencari definisi kolom
    const lines = content.split('\n');

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
        if (trimmed.startsWith('$table->')) {
            let colName = '';
            let colType = '';
            
            // --- A. Handle Shortcut Laravel (id, timestamps, softDeletes, dll) ---
            
            if (trimmed.includes('$table->id()')) {
                columns.push({ column: 'id', type: 'id', label: 'Id', is_required: true, is_unique: true });
                return;
            }
            if (trimmed.includes('$table->timestamps()')) {
                columns.push({ column: 'created_at', type: 'timestamp', label: formatLabel('created_at'), is_required: false, is_unique: false });
                columns.push({ column: 'updated_at', type: 'timestamp', label: formatLabel('updated_at'), is_required: false, is_unique: false });
                return;
            }
            if (trimmed.includes('$table->softDeletes()')) {
                columns.push({ column: 'deleted_at', type: 'softDeletes', label: formatLabel('deleted_at'), is_required: false, is_unique: false });
                return;
            }
            if (trimmed.includes('$table->rememberToken()')) {
                columns.push({ column: 'remember_token', type: 'rememberToken', label: formatLabel('remember_token'), is_required: false, is_unique: false });
                return;
            }

            // --- B. Handle Definisi Kolom Standar ($table->string('name')) ---
            
            // Regex: $table->tipe('nama_kolom')
            // Menangkap: tipe dan nama kolom (di dalam tanda kutip pertama)
            const regexStandard = /\$table->([a-zA-Z0-9]+)\(['"]([^'"]+)['"]/; 
            const match = trimmed.match(regexStandard);

            if (match) {
                colType = match[1]; // string, integer, text, dll
                colName = match[2]; // name, email, dll
            } else {
                // Cek edge case seperti foreignId('user_id')
                const regexForeign = /\$table->foreignId\(['"]([^'"]+)['"]/;
                const matchForeign = trimmed.match(regexForeign);
                if (matchForeign) {
                    colType = 'foreignId';
                    colName = matchForeign[1];
                }
            }

            // Jika kolom ditemukan, proses atribut tambahan
            if (colName) {
                const isNullable = trimmed.includes('->nullable()');
                const isUnique = trimmed.includes('->unique()');
                // Asumsi: Jika nullable, maka NOT required. Jika tidak nullable, maka required.
                // Kecuali ada ->default(), tapi untuk simplifikasi kita anggap required dulu.
                const isRequired = !isNullable; 

                columns.push({
                    column: colName,
                    type: colType,
                    label: formatLabel(colName),
                    is_required: isRequired,
                    is_unique: isUnique
                });
            }
        }
    });

    return { tableName, columns };
};

const run = () => {
    try {
        console.log("🚀 Memulai ekstraksi data migration...");

        if (!fs.existsSync(migrationDir)) {
            throw new Error(`Folder migration tidak ditemukan: ${migrationDir}`);
        }

        // Pastikan folder output ada
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const files = fs.readdirSync(migrationDir).filter(f => f.endsWith('.php')).sort();
        const outputData = {};

        files.forEach(file => {
            const filePath = path.join(migrationDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            
            const parsed = parseMigrationContent(content);

            // Format Output sesuai permintaan: Array berisi object table info
            outputData[file] = [
                {
                    table_name: parsed.tableName,
                    columns: parsed.columns
                }
            ];
            
            console.log(`✅ Processed: ${file} (${parsed.tableName})`);
        });

        // Tulis ke file JSON
        fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2)); // Indent 2 spasi

        console.log("---");
        console.log(`🎉 Sukses! Data disimpan di: ${outputFile}`);

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
};

run();