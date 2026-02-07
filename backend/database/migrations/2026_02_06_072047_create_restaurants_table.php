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
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();                     // Restaurant ID (101,102,...)
            $table->string('name');          // Restaurant name
            $table->string('location');      // City
            $table->string('cuisine');       // Cuisine type (from JSON)
            $table->timestamps();            // created_at / updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
