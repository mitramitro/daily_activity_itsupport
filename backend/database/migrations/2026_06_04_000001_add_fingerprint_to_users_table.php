<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('fingerprint_enabled')->default(false)->after('office_id');
            $table->string('fingerprint_token_hash', 255)->nullable()->unique()->after('fingerprint_enabled');
            $table->string('device_id', 255)->nullable()->after('fingerprint_token_hash');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['fingerprint_enabled', 'fingerprint_token_hash', 'device_id']);
        });
    }
};
