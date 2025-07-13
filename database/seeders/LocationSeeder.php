<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $provincesSql = file_get_contents(database_path('sql/provinces.sql'));
        DB::unprepared($provincesSql);
        $citiesSql = file_get_contents(database_path('sql/cities.sql'));
        DB::unprepared($citiesSql);
        $districtsSql = file_get_contents(database_path('sql/districts.sql'));
        DB::unprepared($districtsSql);
    }
}
