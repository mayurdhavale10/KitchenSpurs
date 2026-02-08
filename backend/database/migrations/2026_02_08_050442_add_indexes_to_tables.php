<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->index('cuisine');
            $table->index('location');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index('ordered_at');
            $table->index('order_amount');
            // Adding a composite index for filtering by restaurant and time together
            $table->index(['restaurant_id', 'ordered_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropIndex(['cuisine']);
            $table->dropIndex(['location']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['ordered_at']);
            $table->dropIndex(['order_amount']);
            $table->dropIndex(['restaurant_id', 'ordered_at']);
        });
    }
};
