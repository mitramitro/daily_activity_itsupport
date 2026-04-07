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
        Schema::create('tasks', function (Blueprint $table) {

            $table->id();

            // pekerja yang dilayani
            $table->foreignId('employee_id')
                ->constrained()
                ->cascadeOnDelete();

            // IT support yang mencatat
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // kantor / cabang
            $table->unsignedBigInteger('office_id');

            // kategori perangkat
            $table->string('kategori'); // PC, Laptop, dll

            // jenis task
            $table->enum('jenis_task', [
                'incident',
                'request'
            ]);

            // masalah
            $table->text('kendala');

            // solusi
            $table->text('solusi')->nullable();

            // status task
            $table->enum('status', [
                'pending',
                'in_progress',
                'resolved'
            ])->default('in_progress');

            // tanggal task
            $table->date('tanggal');

            $table->timestamps();

            // index untuk performa laporan
            $table->index('tanggal');
            $table->index('status');
            $table->index('employee_id');
            $table->index('user_id');
            $table->index('office_id');
            $table->index('kategori');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
