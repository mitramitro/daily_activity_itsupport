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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('nomor_pekerja')->unique();

            $table->string('no_hp')->nullable();
            $table->string('email')->nullable();

            $table->string('jabatan');

            $table->enum('status', ['Pekerja', 'Mitra Kerja'])
                ->default('Pekerja');

            $table->unsignedBigInteger('office_id')->nullable();

            $table->timestamps();

            $table->foreign('office_id')
                ->references('id')
                ->on('offices')
                ->nullOnDelete();

            // index untuk search cepat
            $table->index('nama');
            $table->index('nomor_pekerja');
            $table->index('office_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
