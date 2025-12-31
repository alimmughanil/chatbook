import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- KONFIGURASI PATH ---
const jsonPath = path.resolve(__dirname, '../../resources/json/migrations.json');
const factoriesDir = path.resolve(__dirname, '../../database/factories');
const seedersDir = path.resolve(__dirname, '../../database/seeders');

// --- KAMUS DATA REAL (FREELANCER MARKETPLACE CONTEXT) ---
const realData = {
    // Nama Freelancer / Klien
    names: [
        "Dimas Anggara", "Rina Salsabila", "Budi Santoso", "Citra Kirana", "Eko Prasetyo", 
        "Fani Rahmawati", "Gilang Ramadhan", "Hesti Wijaya", "Indra Lesmana", "Joko Susilo",
        "Kartika Putri", "Lukman Hakim"
    ],
    
    // Judul Gig / Layanan Jasa (Untuk kolom 'title' atau 'name' di table products)
    titles: [
        "Jasa Pembuatan Website Company Profile Responsif",
        "Desain Logo UMKM Professional dalam 24 Jam",
        "Jasa Tulis Artikel SEO Friendly 1000 Kata",
        "Setup dan Optimasi Iklan Facebook & Instagram Ads",
        "Jasa Penerjemah Dokumen Inggris - Indonesia Tersumpah",
        "Pembuatan Aplikasi Android dengan Flutter",
        "Jasa Edit Video Youtube dan Reels Cinematic",
        "Konsultasi Pajak dan Laporan Keuangan Bulanan",
        "Desain UI/UX Aplikasi Mobile Modern",
        "Jasa Entry Data Excel Cepat dan Akurat"
    ],
    
    // Nama Produk Singkat (Untuk variasi)
    products: [
        "Website Landing Page", "Logo Premium", "Artikel SEO", "Social Media Management",
        "Aplikasi Mobile", "Video Editing", "Voice Over Indonesia", "Ilustrasi Wajah",
        "Script Python Automation", "Desain Feed Instagram"
    ],

    // Institusi (Pendidikan Freelancer)
    institutes: [
        "Universitas Indonesia", "Institut Teknologi Bandung", "Binus University", 
        "Universitas Gadjah Mada", "Telkom University", "Politeknik Negeri Media Kreatif",
        "Udemy Course Certification", "Coursera Google Certificate"
    ],

    // Lokasi Freelancer
    locations: [
        "Jakarta Selatan", "Bandung", "Denpasar (Bali)", "Yogyakarta", "Surabaya", 
        "Malang", "Medan", "Tangerang Selatan", "Remote (Indonesia)"
    ],

    // Deskripsi Layanan (Scope of Work)
    descriptions: [
        "Saya akan mengerjakan proyek ini dengan detail dan profesional. Harga sudah termasuk revisi 3x minor. File yang dikirimkan berupa source code lengkap.",
        "Jasa ini cocok untuk UMKM yang ingin meningkatkan branding. Pengerjaan cepat, hasil original, dan file master (AI/EPS) akan diberikan.",
        "Artikel ditulis manual 100% tanpa AI, lolos Copyscape, dan riset keyword mendalam. Garansi kepuasan atau uang kembali.",
        "Membantu mengelola akun sosial media Anda selama 30 hari. Termasuk desain konten, caption, dan riset hashtag.",
        "Pengerjaan menggunakan stack teknologi terbaru (React/Laravel). Website dijamin kencang, aman, dan mobile friendly."
    ],

    // Profil Freelancer (Bio / About Me)
    abouts: [
        "Halo! Saya adalah Full Stack Developer dengan pengalaman 5 tahun menangani klien korporat. Spesialisasi saya di Laravel dan React JS.",
        "Desainer Grafis yang berfokus pada Branding dan Identitas Visual. Telah membantu 100+ UMKM di Indonesia.",
        "Digital Marketer bersertifikasi Google. Fokus saya adalah meningkatkan ROI bisnis Anda melalui FB Ads dan Google Ads.",
        "Penulis konten kreatif dan Copywriter. Saya bisa menulis berbagai niche mulai dari teknologi, kesehatan, hingga travel.",
        "Video Editor profesional. Biasa mengerjakan video profil perusahaan, wedding, dan konten Youtube.",
        "Virtual Assistant yang siap membantu administrasi bisnis Anda agar lebih rapi dan efisien."
    ],

    bank_names: ["Bank Central Asia (BCA)", "Bank Mandiri", "Bank Jago", "Bank Negara Indonesia (BNI)", "Jenius (BTPN)", "GoPay", "OVO"],
    
    // Role user di aplikasi freelance
    roles: ["freelancer", "client", "admin"], 
    
    // Kategori Jasa
    categories: [
        "Web & Programming", "Desain Grafis", "Penulisan & Penerjemahan", 
        "Pemasaran Digital", "Video & Animasi", "Musik & Audio", 
        "Bisnis", "Gaya Hidup"
    ],

    // Tipe Project/Produk
    types: ["service", "digital_product", "subscription"],
    
    statuses: ["active", "suspended", "verified", "pending"]
};

// --- HELPER FUNCTIONS ---
function toPascalCase(str) {
    return str.replace(/(?:^|_)(\w)/g, (_, c) => c ? c.toUpperCase() : '');
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateSlug(text) {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

// Logika Pemetaan Kolom ke Data (Updated Context)
function getValueForColumn(colName, colType, tableName) {
    // 1. Foreign Keys & IDs
    if (colName === 'id') return null;
    if (colType === 'foreignId' || colName.endsWith('_id')) {
        return `rand(1, 5)`; 
    }

    // 2. Users & Profiles
    if (colName === 'email') return `'${generateSlug(getRandom(realData.names))}@gmail.com'`;
    if (colName === 'password') return `bcrypt('password123')`; 
    
    if (colName === 'name' || colName === 'username') {
        // Jika tabel produk/jasa, gunakan nama jasa
        if (tableName.includes('product') || tableName.includes('order')) return `'${getRandom(realData.products)}'`;
        // Jika tabel bank, gunakan nama bank
        if (tableName.includes('bank')) return `'${getRandom(realData.bank_names)}'`;
        // Default nama orang
        return `'${getRandom(realData.names)}'`;
    }

    // 3. Produk / Layanan Jasa
    if (colName === 'title') {
         if (tableName.includes('portfolio')) return `'${getRandom(realData.products)}'`; // Portfolio Title
         return `'${getRandom(realData.titles)}'`; // Gig Title
    }
    
    if (colName === 'slug') return `\\Illuminate\\Support\\Str::slug($attributes['name'] ?? $attributes['title'] ?? 'service-slug')`;

    // 4. Deskripsi & Bio
    if (['description', 'message', 'body', 'instruction', 'note', 'detail'].includes(colName)) {
        return `'${getRandom(realData.descriptions)}'`;
    }
    if (colName === 'about') { // Profil Freelancer
        return `'${getRandom(realData.abouts)}'`;
    }

    // 5. Lokasi & Pendidikan
    if (['institute'].includes(colName)) return `'${getRandom(realData.institutes)}'`;
    if (['branch', 'location', 'address'].includes(colName)) return `'${getRandom(realData.locations)}'`;

    // 6. Kategori & Status
    if (tableName.includes('category') && colName === 'name') return `'${getRandom(realData.categories)}'`;
    
    if (colName === 'status') return `'${getRandom(realData.statuses)}'`;
    if (colName === 'role') return `'${getRandom(realData.roles)}'`;
    if (colName === 'type') {
        if (tableName.includes('product')) return `'service'`; // Default jasa
        return `'${getRandom(realData.types)}'`;
    }

    // 7. Angka (Harga Jasa, dll)
    if (['price', 'gross_amount', 'net_amount', 'fee', 'value', 'price_total', 'price_min', 'price_max'].includes(colName)) {
        // Harga jasa freelancer biasanya kelipatan 50rb/100rb
        return `rand(10, 200) * 10000`; 
    }
    if (colName === 'quantity' || colName === 'rating') return `rand(1, 5)`;
    if (colName === 'duration') return `rand(1, 30)`; // 1-30 Hari
    if (colName === 'duration_unit') return `'Hari'`;

    // 8. Lain-lain
    if (colName === 'thumbnail' || colName === 'picture' || colName === 'file') return `'https://via.placeholder.com/640x480.png/0077cc?text=Service+Image'`;
    if (colType === 'boolean' || colName.startsWith('is_')) return `rand(0, 1)`;
    if (colType === 'timestamp' || colType === 'date' || colName.endsWith('_at')) return `now()`;

    // Fallback
    if (colType === 'string') return `'Data Dummy'`;
    if (colType === 'text' || colType === 'longText') return `'Lorem ipsum dolor sit amet.'`;
    if (colType.includes('integer')) return `rand(1, 100)`;

    return `null`;
}

// --- MAIN PROCESS ---
try {
    if (!fs.existsSync(jsonPath)) {
        console.error(`❌ File JSON tidak ditemukan: ${jsonPath}`);
        process.exit(1);
    }

    const migrations = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    if (!fs.existsSync(factoriesDir)) fs.mkdirSync(factoriesDir, { recursive: true });
    if (!fs.existsSync(seedersDir)) fs.mkdirSync(seedersDir, { recursive: true });

    let databaseSeederContent = "<?php\n\nnamespace Database\\Seeders;\n\nuse Illuminate\\Database\\Seeder;\n\nclass DatabaseSeeder extends Seeder\n{\n    public function run(): void\n    {\n";

    Object.keys(migrations).forEach(migrationFile => {
        const tableData = migrations[migrationFile][0];
        const tableName = tableData.table_name;
        
        if (tableName === 'password_reset_tokens' || tableName === 'personal_access_tokens' || tableName === 'migrations') return;

        const modelName = toPascalCase(tableName.endsWith('s') ? tableName.slice(0, -1) : tableName);
        const factoryFileName = `${modelName}Factory.php`;
        const seederFileName = `${modelName}Seeder.php`;

        console.log(`⚙️  Generating: ${modelName} (Context: Freelance Service)`);

        // GENERATE FACTORY
        let factoryFields = "";
        tableData.columns.forEach(col => {
            const val = getValueForColumn(col.column, col.type, tableName);
            if (val !== null) {
                factoryFields += `            '${col.column}' => ${val},\n`;
            }
        });

        const factoryContent = `<?php

namespace Database\\Factories;

use Illuminate\\Database\\Eloquent\\Factories\\Factory;
use Illuminate\\Support\\Str;
use App\\Models\\${modelName};

class ${modelName}Factory extends Factory
{
    public function definition(): array
    {
        return [
${factoryFields}        ];
    }
}
`;
        fs.writeFileSync(path.join(factoriesDir, factoryFileName), factoryContent);

        // GENERATE SEEDER
        const seederContent = `<?php

namespace Database\\Seeders;

use Illuminate\\Database\\Seeder;
use App\\Models\\${modelName};

class ${modelName}Seeder extends Seeder
{
    public function run(): void
    {
        ${modelName}::factory()->count(10)->create();
    }
}
`;
        fs.writeFileSync(path.join(seedersDir, seederFileName), seederContent);
        databaseSeederContent += `        $this->call(${modelName}Seeder::class);\n`;
    });

    databaseSeederContent += "    }\n}\n";
    fs.writeFileSync(path.join(seedersDir, 'DatabaseSeeder.php'), databaseSeederContent);
    console.log("\n✅ Sukses! Data dummy disesuaikan dengan konteks 'Jasa Freelancer'.");

} catch (error) {
    console.error("❌ Terjadi kesalahan:", error);
}