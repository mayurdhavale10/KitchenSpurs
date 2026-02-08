<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function restaurantTrends(Request $request, $id)
    {
        // Fix: Date must include the entire end day (23:59:59)
        $from = $request->from;
        $to = $request->to ? $request->to . ' 23:59:59' : null;

        $search = $request->search;
        $cuisine = $request->cuisine;
        $location = $request->location;

        $minAmount = $request->min_amount;
        $maxAmount = $request->max_amount;
        $startHour = $request->start_hour;
        $endHour = $request->end_hour;

        // Base Query with ALL filters
        $base = DB::table('orders')
            ->join('restaurants','orders.restaurant_id','=','restaurants.id')
            ->where('restaurants.id',$id)
            ->whereBetween('ordered_at', [$from, $to])
            ->when($search, fn($q)=>$q->where('restaurants.name','like',"%$search%"))
            ->when($cuisine, fn($q)=>$q->where('restaurants.cuisine',$cuisine))
            ->when($location, fn($q)=>$q->where('restaurants.location',$location))
            ->when($minAmount, fn($q)=>$q->where('order_amount','>=',$minAmount))
            ->when($maxAmount, fn($q)=>$q->where('order_amount','<=',$maxAmount))
            ->when($startHour !== null && $startHour !== '', fn($q)=>$q->whereRaw('HOUR(ordered_at) >= ?',[$startHour]))
            ->when($endHour !== null && $endHour !== '', fn($q)=>$q->whereRaw('HOUR(ordered_at) <= ?',[$endHour]));

        $daily = (clone $base)
            ->selectRaw('DATE(ordered_at) date, COUNT(*) orders, SUM(order_amount) revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $avg = (clone $base)->avg('order_amount');

        $dailyPeak = (clone $base)
            ->selectRaw('DATE(ordered_at) date, HOUR(ordered_at) hour, COUNT(*) total')
            ->groupBy('date','hour')
            ->orderByDesc('total')
            ->get()
            ->groupBy('date')
            ->map(fn($d)=>$d->first());

        return response()->json([
            'daily'=>$daily,
            'average_order_value'=>round($avg,2),
            'daily_peak_hours'=>$dailyPeak
        ]);
    }

    public function topRestaurants(Request $request)
    {
        // Fix: Date must include the entire end day
        $to = $request->to ? $request->to . ' 23:59:59' : null;

        return DB::table('orders')
            ->join('restaurants','orders.restaurant_id','=','restaurants.id')
            ->whereBetween('ordered_at',[$request->from, $to])
            ->when($request->location,fn($q)=>$q->where('restaurants.location',$request->location))
            ->when($request->search, fn($q)=>$q->where('restaurants.name','like',"%$request->search%"))
            ->when($request->cuisine, fn($q)=>$q->where('restaurants.cuisine',$request->cuisine))
            ->when($request->min_amount, fn($q)=>$q->where('order_amount','>=',$request->min_amount))
            ->when($request->max_amount, fn($q)=>$q->where('order_amount','<=',$request->max_amount))
            ->when($request->start_hour, fn($q)=>$q->whereRaw('HOUR(ordered_at) >= ?',[$request->start_hour]))
            ->when($request->end_hour, fn($q)=>$q->whereRaw('HOUR(ordered_at) <= ?',[$request->end_hour]))
            ->selectRaw('restaurants.name, COUNT(*) orders, SUM(order_amount) revenue')
            ->groupBy('restaurants.id', 'restaurants.name')
            ->orderByDesc('revenue')
            ->limit(3)
            ->get();
    }
}
