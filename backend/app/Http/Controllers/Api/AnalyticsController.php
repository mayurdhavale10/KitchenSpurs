<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function restaurantTrends(Request $request, $id)
    {
        $from = $request->from;
        $to = $request->to;

        $search = $request->search;
        $cuisine = $request->cuisine;
        $location = $request->location;

        $minAmount = $request->min_amount;
        $maxAmount = $request->max_amount;
        $startHour = $request->start_hour;
        $endHour = $request->end_hour;

        // Base Query with SQLite compatible date functions
        $base = DB::table('orders')
            ->join('restaurants', 'orders.restaurant_id', '=', 'restaurants.id')
            ->where('restaurants.id', $id)
            ->whereBetween('ordered_at', [$from, $to])
            ->when($search, fn($q) => $q->where('restaurants.name', 'like', "%$search%"))
            ->when($cuisine, fn($q) => $q->where('restaurants.cuisine', $cuisine))
            ->when($location, fn($q) => $q->where('restaurants.location', $location))
            ->when($minAmount, fn($q) => $q->where('order_amount', '>=', $minAmount))
            ->when($maxAmount, fn($q) => $q->where('order_amount', '<=', $maxAmount))
            // SQLite uses strftime for hour extraction
            ->when($startHour !== null, fn($q) => $q->whereRaw("CAST(strftime('%H', ordered_at) AS INTEGER) >= ?", [$startHour]))
            ->when($endHour !== null, fn($q) => $q->whereRaw("CAST(strftime('%H', ordered_at) AS INTEGER) <= ?", [$endHour]));

        // Optimizing: Fetch Daily Stats in one go
        $daily = (clone $base)
            ->selectRaw("DATE(ordered_at) as date, COUNT(*) as orders, SUM(order_amount) as revenue")
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Optimizing: Calculate Average directly
        $avg = (clone $base)->avg('order_amount');

        // Optimizing: Daily Peak calculation
        // We fetch hourly counts, then in PHP we quickly find the max per day. 
        // This is efficient enough for monthly data without complex window functions in raw SQL.
        $dailyPeak = (clone $base)
            ->selectRaw("DATE(ordered_at) as date, strftime('%H', ordered_at) as hour, COUNT(*) as total")
            ->groupBy('date', 'hour')
            ->orderByDesc('total')
            ->get()
            ->groupBy('date')
            ->map(fn($d) => $d->first()); // Taking the first (highest) since we ordered by total desc

        return response()->json([
            'daily' => $daily,
            'average_order_value' => round($avg, 2),
            'daily_peak_hours' => $dailyPeak
        ]);
    }

    public function topRestaurants(Request $request)
    {
        return DB::table('orders')
            ->join('restaurants','orders.restaurant_id','=','restaurants.id')
            ->whereBetween('ordered_at',[$request->from,$request->to])
            ->when($request->location,fn($q)=>$q->where('restaurants.location',$request->location))
            ->selectRaw('restaurants.name, COUNT(*) orders, SUM(order_amount) revenue')
            ->groupBy('restaurants.id')
            ->orderByDesc('revenue')
            ->limit(3)
            ->get();
    }
}
