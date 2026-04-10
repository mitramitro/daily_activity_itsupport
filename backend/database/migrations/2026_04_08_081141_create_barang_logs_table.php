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
        Schema::create('barang_logs', function (Blueprint $table) {
            $table->id();

            // Relasi utama
            $table->foreignId('barang_id')->constrained('barang')->cascadeOnDelete();

            // Qty
            $table->integer('qty');

            // IN / OUT
            $table->enum('type', ['IN', 'OUT']);

            // Office
            $table->foreignId('from_office_id')->nullable()->constrained('offices')->nullOnDelete();
            $table->foreignId('to_office_id')->nullable()->constrained('offices')->nullOnDelete();

            // Employee
            $table->foreignId('from_employee_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('to_employee_id')->nullable()->constrained('employees')->nullOnDelete();

            // Kondisi barang
            $table->enum('condition', ['baru', 'bekas', 'rusak'])->nullable();

            // Tambahan
            $table->text('notes')->nullable();

            // Tanggal transaksi (bukan created_at)
            $table->date('tanggal');

            // User input (IT Support)
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();

            $table->timestamps();

            // Index biar cepat
            $table->index(['barang_id']);
            $table->index(['from_office_id']);
            $table->index(['to_office_id']);
            $table->index(['tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang_logs');
    }
};
