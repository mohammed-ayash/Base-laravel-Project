<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('brand_translations', function (Blueprint $table) {
            $table->id();
            $table->string('locale')->index();

            // Foreign key to the main model
            $table->unsignedBigInteger('brand_id');
            $table->unique(['brand_id', 'locale']);
            $table->foreign('brand_id')->references('id')->on('brands')->onDelete('cascade');

            // Actual fields we want to translate
            $table->string('name');
            $table->string('description');
        });

        DB::statement('ALTER TABLE brand_translations ADD FULLTEXT idx_search_title(name, description)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('brand_translations');
    }
};
