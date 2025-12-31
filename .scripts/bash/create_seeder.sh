#!/bin/bash

# ==========================================
# SETUP DIRECTORIES
# ==========================================
mkdir -p database/factories
mkdir -p database/seeders

echo "🚀 Memulai Generasi Factory & Seeder Lengkap (Freelancer Context)..."

# ==========================================
# 1. CORE & AUTH (User, Profile, Config)
# ==========================================

# --- User ---
cat << 'EOF' > database/factories/UserFactory.php
<?php
namespace Database\Factories;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory {
    protected $model = User::class;
    public function definition(): array {
        $name = fake()->name();
        return [
            'name' => $name,
            'username' => Str::slug($name) . fake()->numerify('##'),
            'phone' => '08' . fake()->numerify('##########'),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => fake()->randomElement(['freelancer', 'client']),
            'picture' => 'https://ui-avatars.com/api/?name=' . urlencode($name),
            'status' => 'active',
            'remember_token' => Str::random(10),
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/UserSeeder.php
<?php
namespace Database\Seeders;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder {
    public function run(): void {
        User::factory()->create(['name'=>'Admin','email'=>'admin@app.com','role'=>'admin','password'=>Hash::make('password')]);
        User::factory()->count(10)->create(['role'=>'freelancer']);
        User::factory()->count(10)->create(['role'=>'client']);
    }
}
EOF
echo "✅ User Created"

# --- Profile ---
cat << 'EOF' > database/factories/ProfileFactory.php
<?php
namespace Database\Factories;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory {
    protected $model = Profile::class;
    public function definition(): array {
        return [
            'user_id' => User::factory(),
            'about' => "Saya profesional dengan pengalaman 5 tahun. Siap membantu proyek Anda.",
            'institute' => fake()->randomElement(['UI', 'ITB', 'UGM', 'Binus']),
            'branch' => fake()->city(),
            'job_title' => fake()->jobTitle(),
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/ProfileSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder {
    public function run(): void {
        $users = User::where('role', 'freelancer')->get();
        foreach($users as $user) { Profile::factory()->create(['user_id' => $user->id]); }
    }
}
EOF
echo "✅ Profile Created"

# --- Configuration ---
cat << 'EOF' > database/factories/ConfigurationFactory.php
<?php
namespace Database\Factories;
use App\Models\Configuration;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConfigurationFactory extends Factory {
    protected $model = Configuration::class;
    public function definition(): array {
        return [
            'type' => fake()->word(),
            'value' => fake()->sentence(),
            'status' => 'active',
            'description' => fake()->sentence(),
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/ConfigurationSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Configuration;
use Illuminate\Database\Seeder;

class ConfigurationSeeder extends Seeder {
    public function run(): void {
        $configs = ['site_title' => 'FreelanceApp', 'site_currency' => 'IDR', 'admin_email' => 'admin@app.com'];
        foreach($configs as $key => $val) {
            Configuration::create(['type' => 'general', 'value' => $val, 'status' => 'active', 'description' => $key]);
        }
    }
}
EOF
echo "✅ Configuration Created"

# ==========================================
# 2. MASTER DATA (Categories, Banks, Tags)
# ==========================================

# --- Category (Service) ---
cat << 'EOF' > database/factories/CategoryFactory.php
<?php
namespace Database\Factories;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory {
    protected $model = Category::class;
    public function definition(): array {
        $name = fake()->unique()->word();
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'type' => 'service',
            'is_thumbnail_icon' => true,
            'is_active' => true,
            'is_featured' => false,
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/CategorySeeder.php
<?php
namespace Database\Seeders;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder {
    public function run(): void {
        $cats = ['Programming', 'Design', 'Writing', 'Marketing', 'Video'];
        foreach($cats as $c) { Category::create(['name'=>$c, 'slug'=>Str::slug($c), 'type'=>'service', 'is_thumbnail_icon'=>true, 'is_active'=>true, 'is_featured'=>true]); }
    }
}
EOF
echo "✅ Category Created"

# --- Blog Category ---
cat << 'EOF' > database/factories/BlogCategoryFactory.php
<?php
namespace Database\Factories;
use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogCategoryFactory extends Factory {
    protected $model = BlogCategory::class;
    public function definition(): array {
        $name = fake()->unique()->word();
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'status' => 'active',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/BlogCategorySeeder.php
<?php
namespace Database\Seeders;
use App\Models\BlogCategory;
use Illuminate\Database\Seeder;

class BlogCategorySeeder extends Seeder {
    public function run(): void {
        BlogCategory::factory()->count(5)->create();
    }
}
EOF
echo "✅ Blog Category Created"

# --- Supported Bank ---
cat << 'EOF' > database/factories/SupportedBankFactory.php
<?php
namespace Database\Factories;
use App\Models\SupportedBank;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupportedBankFactory extends Factory {
    protected $model = SupportedBank::class;
    public function definition(): array {
        return [
            'bank_code' => fake()->unique()->swiftBicNumber(),
            'bank_name' => fake()->company(),
            'bi_fast' => true,
            'status' => 'active',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/SupportedBankSeeder.php
<?php
namespace Database\Seeders;
use App\Models\SupportedBank;
use Illuminate\Database\Seeder;

class SupportedBankSeeder extends Seeder {
    public function run(): void {
        $banks = ['BCA', 'Mandiri', 'BNI', 'BRI', 'Jago'];
        foreach($banks as $b) { SupportedBank::create(['bank_code'=>strtoupper($b), 'bank_name'=>$b, 'bi_fast'=>true, 'status'=>'active']); }
    }
}
EOF
echo "✅ Supported Bank Created"

# --- Tags ---
cat << 'EOF' > database/factories/TagFactory.php
<?php
namespace Database\Factories;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TagFactory extends Factory {
    protected $model = Tag::class;
    public function definition(): array {
        $t = fake()->unique()->word();
        return [
            'title' => $t,
            'slug' => Str::slug($t),
            'is_active' => true,
            'is_featured' => false,
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/TagSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder {
    public function run(): void {
        Tag::factory()->count(10)->create();
    }
}
EOF
echo "✅ Tag Created"


# ==========================================
# 3. BLOGS & CONTENT
# ==========================================

# --- Blog ---
cat << 'EOF' > database/factories/BlogFactory.php
<?php
namespace Database\Factories;
use App\Models\Blog;
use App\Models\User;
use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogFactory extends Factory {
    protected $model = Blog::class;
    public function definition(): array {
        $title = fake()->sentence();
        return [
            'category_id' => BlogCategory::inRandomOrder()->first()->id ?? BlogCategory::factory(),
            'user_id' => User::where('role','admin')->first()->id ?? User::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'thumbnail' => 'https://placehold.co/600x400?text=Blog',
            'keyword' => 'tips, freelance, tutorial',
            'description' => fake()->paragraphs(3, true),
            'status' => 'published',
            'published_at' => now(),
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/BlogSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Blog;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder {
    public function run(): void {
        Blog::factory()->count(10)->create();
    }
}
EOF
echo "✅ Blog Created"

# --- Banner ---
cat << 'EOF' > database/factories/BannerFactory.php
<?php
namespace Database\Factories;
use App\Models\Banner;
use Illuminate\Database\Eloquent\Factories\Factory;

class BannerFactory extends Factory {
    protected $model = Banner::class;
    public function definition(): array {
        return [
            'type' => 'slider',
            'file' => 'https://placehold.co/1200x400?text=Promo',
            'title' => 'Diskon Spesial Hari Ini',
            'description' => 'Gunakan kode promo untuk potongan harga.',
            'is_action_button' => true,
            'action_url' => '#',
            'status' => 'active',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/BannerSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder {
    public function run(): void {
        Banner::factory()->count(3)->create();
    }
}
EOF
echo "✅ Banner Created"


# ==========================================
# 4. PRODUCTS, PORTFOLIO & SERVICES
# ==========================================

# --- Portfolio Category ---
cat << 'EOF' > database/factories/PortfolioCategoryFactory.php
<?php
namespace Database\Factories;
use App\Models\PortfolioCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PortfolioCategoryFactory extends Factory {
    protected $model = PortfolioCategory::class;
    public function definition(): array {
        $t = fake()->unique()->word();
        return ['title'=>$t, 'slug'=>Str::slug($t), 'description'=>'Kategori portfolio.'];
    }
}
EOF

cat << 'EOF' > database/seeders/PortfolioCategorySeeder.php
<?php
namespace Database\Seeders;
use App\Models\PortfolioCategory;
use Illuminate\Database\Seeder;

class PortfolioCategorySeeder extends Seeder {
    public function run(): void {
        PortfolioCategory::factory()->count(5)->create();
    }
}
EOF
echo "✅ Portfolio Category Created"

# --- Portfolio Project ---
cat << 'EOF' > database/factories/PortfolioProjectFactory.php
<?php
namespace Database\Factories;
use App\Models\PortfolioProject;
use App\Models\User;
use App\Models\PortfolioCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PortfolioProjectFactory extends Factory {
    protected $model = PortfolioProject::class;
    public function definition(): array {
        $name = "Project " . fake()->company();
        return [
            'user_id' => User::where('role','partner')->inRandomOrder()->first()->id ?? User::factory(),
            'category_id' => PortfolioCategory::inRandomOrder()->first()->id ?? PortfolioCategory::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'duration_unit' => 'Days',
            'description' => 'Hasil pengerjaan website company profile.',
            'is_show_client' => true,
            'project_status' => 'completed',
            'status' => 'published',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/PortfolioProjectSeeder.php
<?php
namespace Database\Seeders;
use App\Models\PortfolioProject;
use Illuminate\Database\Seeder;

class PortfolioProjectSeeder extends Seeder {
    public function run(): void {
        PortfolioProject::factory()->count(20)->create();
    }
}
EOF
echo "✅ Portfolio Project Created"

# --- Product ---
cat << 'EOF' > database/factories/ProductFactory.php
<?php
namespace Database\Factories;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory {
    protected $model = Product::class;
    public function definition(): array {
        $titles = ['Jasa Desain Logo', 'Pembuatan Website', 'Artikel SEO', 'Video Editing', 'Admin Sosmed'];
        $t = fake()->randomElement($titles) . ' ' . fake()->word();
        return [
            'user_id' => User::where('role','partner')->inRandomOrder()->first()->id ?? User::factory(),
            'category_id' => Category::inRandomOrder()->first()->id ?? Category::factory(),
            'name' => $t,
            'slug' => Str::slug($t),
            'price' => fake()->numberBetween(5, 50) * 10000,
            'description' => 'Pengerjaan cepat dan profesional. Revisi sepuasnya.',
            'status' => 'active',
            'is_featured' => fake()->boolean(),
            'thumbnail' => 'https://placehold.co/600x400?text=Service',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/ProductSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder {
    public function run(): void {
        Product::factory()->count(30)->create();
    }
}
EOF
echo "✅ Product Created"

# --- Product Detail ---
cat << 'EOF' > database/factories/ProductDetailFactory.php
<?php
namespace Database\Factories;
use App\Models\ProductDetail;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductDetailFactory extends Factory {
    protected $model = ProductDetail::class;
    public function definition(): array {
        return [
            'product_id' => Product::inRandomOrder()->first()->id,
            'name' => 'Paket Basic',
            'price' => 100000,
            'is_custom' => false,
            'status' => 'active',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/ProductDetailSeeder.php
<?php
namespace Database\Seeders;
use App\Models\ProductDetail;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductDetailSeeder extends Seeder {
    public function run(): void {
        $products = Product::all();
        foreach($products as $p) { ProductDetail::factory()->create(['product_id'=>$p->id]); }
    }
}
EOF
echo "✅ Product Detail Created"


# ==========================================
# 5. TRANSACTIONS (Orders, Payments, Finance)
# ==========================================

# --- Order ---
cat << 'EOF' > database/factories/OrderFactory.php
<?php
namespace Database\Factories;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory {
    protected $model = Order::class;
    public function definition(): array {
        $prod = Product::inRandomOrder()->first();
        return [
            'user_id' => User::where('role','user')->inRandomOrder()->first()->id ?? User::factory(),
            'product_id' => $prod->id,
            'type' => 'service',
            'order_number' => 'ORD-' . strtoupper(fake()->bothify('??####')),
            'quantity' => 1,
            'product_price' => $prod->price,
            'price_total' => $prod->price,
            'status' => fake()->randomElement(['pending','paid','completed']),
            'note' => 'Mohon segera diproses.',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/OrderSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Order;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder {
    public function run(): void {
        Order::factory()->count(20)->create();
    }
}
EOF
echo "✅ Order Created"

# --- Payment ---
cat << 'EOF' > database/factories/PaymentFactory.php
<?php
namespace Database\Factories;
use App\Models\Payment;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory {
    protected $model = Payment::class;
    public function definition(): array {
        $order = Order::inRandomOrder()->first();
        return [
            'order_id' => $order->id,
            'gross_amount' => $order->price_total,
            'unix_timestamp' => time(),
            'status' => $order->status === 'paid' ? 'settlement' : 'pending',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/PaymentSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Payment;
use App\Models\Order;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder {
    public function run(): void {
        $orders = Order::where('status', 'paid')->get();
        foreach($orders as $o) { Payment::factory()->create(['order_id'=>$o->id, 'gross_amount'=>$o->price_total, 'status'=>'settlement']); }
    }
}
EOF
echo "✅ Payment Created"

# --- Bank (User Bank) ---
cat << 'EOF' > database/factories/BankFactory.php
<?php
namespace Database\Factories;
use App\Models\Bank;
use App\Models\SupportedBank;
use Illuminate\Database\Eloquent\Factories\Factory;

class BankFactory extends Factory {
    protected $model = Bank::class;
    public function definition(): array {
        return [
            'supported_bank_id' => SupportedBank::inRandomOrder()->first()->id,
            'bank_account' => fake()->bankAccountNumber(),
            'bank_alias' => fake()->name(),
            'is_primary' => true,
            'status' => 'active',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/BankSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Bank;
use Illuminate\Database\Seeder;

class BankSeeder extends Seeder {
    public function run(): void {
        Bank::factory()->count(10)->create();
    }
}
EOF
echo "✅ Bank Created"

# --- Wallet ---
cat << 'EOF' > database/factories/WalletFactory.php
<?php
namespace Database\Factories;
use App\Models\Wallet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class WalletFactory extends Factory {
    protected $model = Wallet::class;
    public function definition(): array {
        return [
            'user_id' => User::where('role','partner')->inRandomOrder()->first()->id,
            'debit' => 1000000,
            'credit' => 0,
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/WalletSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Wallet;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder {
    public function run(): void {
        Wallet::factory()->count(10)->create();
    }
}
EOF
echo "✅ Wallet Created"

# --- Withdraw ---
cat << 'EOF' > database/factories/WithdrawFactory.php
<?php
namespace Database\Factories;
use App\Models\Withdraw;
use App\Models\User;
use App\Models\Bank;
use Illuminate\Database\Eloquent\Factories\Factory;

class WithdrawFactory extends Factory {
    protected $model = Withdraw::class;
    public function definition(): array {
        return [
            'user_id' => User::where('role','partner')->inRandomOrder()->first()->id,
            'bank_id' => Bank::inRandomOrder()->first()->id ?? Bank::factory(),
            'gross_amount' => 500000,
            'net_amount' => 495000,
            'fee' => 5000,
            'status' => 'pending',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/WithdrawSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Withdraw;
use Illuminate\Database\Seeder;

class WithdrawSeeder extends Seeder {
    public function run(): void {
        Withdraw::factory()->count(5)->create();
    }
}
EOF
echo "✅ Withdraw Created"


# ==========================================
# 6. SUPPORT & MISC
# ==========================================

# --- Activity ---
cat << 'EOF' > database/factories/ActivityFactory.php
<?php
namespace Database\Factories;
use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory {
    protected $model = Activity::class;
    public function definition(): array {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'ip_address' => fake()->ipv4(),
            'menu' => 'Dashboard',
            'type' => 'Login',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/ActivitySeeder.php
<?php
namespace Database\Seeders;
use App\Models\Activity;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder {
    public function run(): void {
        Activity::factory()->count(50)->create();
    }
}
EOF
echo "✅ Activity Created"

# --- Feedback ---
cat << 'EOF' > database/factories/FeedbackFactory.php
<?php
namespace Database\Factories;
use App\Models\Feedback;
use App\Models\User;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFactory extends Factory {
    protected $model = Feedback::class;
    public function definition(): array {
        return [
            'user_id' => User::where('role','user')->inRandomOrder()->first()->id,
            'order_id' => Order::inRandomOrder()->first()->id,
            'message' => 'Sangat puas dengan hasilnya!',
            'rating' => 5,
            'type' => 'review',
            'status' => 'active',
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/FeedbackSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Feedback;
use Illuminate\Database\Seeder;

class FeedbackSeeder extends Seeder {
    public function run(): void {
        Feedback::factory()->count(10)->create();
    }
}
EOF
echo "✅ Feedback Created"

# --- Contact ---
cat << 'EOF' > database/factories/ContactFactory.php
<?php
namespace Database\Factories;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory {
    protected $model = Contact::class;
    public function definition(): array {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'message' => 'Halo admin, saya ingin bertanya.',
            'is_reply' => false,
        ];
    }
}
EOF

cat << 'EOF' > database/seeders/ContactSeeder.php
<?php
namespace Database\Seeders;
use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder {
    public function run(): void {
        Contact::factory()->count(5)->create();
    }
}
EOF
echo "✅ Contact Created"


# ==========================================
# 7. MAIN DATABASE SEEDER
# ==========================================

cat << 'EOF' > database/seeders/DatabaseSeeder.php
<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
    public function run(): void {
        $this->call([
            UserSeeder::class,
            ProfileSeeder::class,
            ConfigurationSeeder::class,
            CategorySeeder::class,
            BlogCategorySeeder::class,
            SupportedBankSeeder::class,
            TagSeeder::class,
            BlogSeeder::class,
            BannerSeeder::class,
            PortfolioCategorySeeder::class,
            PortfolioProjectSeeder::class,
            ProductSeeder::class,
            ProductDetailSeeder::class,
            OrderSeeder::class,
            PaymentSeeder::class,
            BankSeeder::class,
            WalletSeeder::class,
            WithdrawSeeder::class,
            ActivitySeeder::class,
            FeedbackSeeder::class,
            ContactSeeder::class,
        ]);
    }
}
EOF
echo "✅ DatabaseSeeder Updated"

echo "🎉 GENERATE COMPLETE! Jalankan: php artisan migrate:fresh --seed"