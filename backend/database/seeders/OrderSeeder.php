<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(storage_path('app/orders.json')), true);

        DB::table('orders')->insert(
            collect($data)->map(fn ($o) => [
                'id' => $o['id'],
                'restaurant_id' => $o['restaurant_id'],
                'order_amount' => $o['order_amount'],  // ✅ Matches migration
                'ordered_at' => $o['order_time'],      // ✅ Maps JSON to DB
                'created_at' => now(),
                'updated_at' => now(),
            ])->toArray()
        );
    }
}