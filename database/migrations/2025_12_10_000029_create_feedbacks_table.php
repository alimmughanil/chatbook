<?php

use App\Enums\FeedbackType;
use App\Enums\ChatStatusType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained('orders');
            $table->foreignId('product_id')->nullable()->constrained('products');
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->longText('message')->nullable();
            $table->integer('rating')->nullable();
            $table->string('type')->default(FeedbackType::Comment)->index();
            $table->string('status')->default(ChatStatusType::Sent)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};
