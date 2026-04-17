<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barang_stocks', function (Blueprint $table) {
            $table->id();

            // Relasi
            $table->foreignId('barang_id')
                ->constrained('barang')
                ->cascadeOnDelete();

            $table->foreignId('office_id')
                ->constrained('offices')
                ->cascadeOnDelete();

            // Stock per lokasnya
            $table->integer('stock')->default(0);

            $table->timestamps();

            // 🔥 UNIQUE (WAJIB)
            $table->unique(['barang_id', 'office_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barang_stocks');
    }
};
