<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Restaurant Trends + Filters
     */
    public function restaurantTrends(Request $request, $id)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        $minAmount = $request->query('min_amount');
        $maxAmount = $request->query('max_amount');
        $startHour = $request->query('start_hour');
        $endHour = $request->query('end_hour');

        // Base query with ALL filters
        $base = DB::table('orders')
            ->where('restaurant_id', $id)
            ->whereBetween('ordered_at', [$from, $to])
            ->when($minAmount, fn ($q) => $q->where('order_amount', '>=', $minAmount))
            ->when($maxAmount, fn ($q) => $q->where('order_amount', '<=', $maxAmount))
            ->when($startHour !== null, fn ($q) => $q->whereRaw('HOUR(ordered_at) >= ?', [$startHour]))
            ->when($endHour !== null, fn ($q) => $q->whereRaw('HOUR(ordered_at) <= ?', [$endHour]));

        // Daily Orders + Revenue
        $daily = (clone $base)
            ->selectRaw('DATE(ordered_at) as date, COUNT(*) as orders, SUM(order_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Average Order Value
        $avg = (clone $base)->avg('order_amount');

        // DAILY peak hour
        $dailyPeak = (clone $base)
            ->selectRaw('DATE(ordered_at) as date, HOUR(ordered_at) as hour, COUNT(*) as total')
            ->groupBy('date', 'hour')
            ->orderBy('date')
            ->orderByDesc('total')
            ->get()
            ->groupBy('date')
            ->map(fn ($d) => $d->first());

        return response()->json([
            'daily' => $daily,
            'average_order_value' => round($avg, 2),
            'daily_peak_hours' => $dailyPeak
        ]);
    }

    /**
     * Top Restaurants with Filters
     */
    public function topRestaurants(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        $minAmount = $request->query('min_amount');
        $maxAmount = $request->query('max_amount');

        $top = DB::table('orders')
            ->join('restaurants', 'orders.restaurant_id', '=', 'restaurants.id')
            ->whereBetween('ordered_at', [$from, $to])
            ->when($minAmount, fn ($q) => $q->where('order_amount', '>=', $minAmount))
            ->when($maxAmount, fn ($q) => $q->where('order_amount', '<=', $maxAmount))
            ->selectRaw('restaurants.name, SUM(order_amount) as revenue, COUNT(*) as orders')
            ->groupBy('restaurants.id', 'restaurants.name')
            ->orderByDesc('revenue')
            ->limit(3)
            ->get();

        return response()->json($top);
    }
}
