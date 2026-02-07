<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(storage_path('app/restaurants.json')), true);

        DB::table('restaurants')->insert(
            collect($data)->map(fn ($r) => [
                'id' => $r['id'],
                'name' => $r['name'],
                'location' => $r['location'],
                'cuisine' => $r['cuisine'],
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray()
        );
    }
}
