<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    /**
     * List restaurants with search, filters, sorting, pagination
     */
    public function index(Request $request)
    {
        $query = Restaurant::query();

        // 🔍 Search by name, cuisine, or location
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('cuisine', 'like', "%$search%")
                  ->orWhere('location', 'like', "%$search%");
            });
        }

        // 🍽 Filter by cuisine
        if ($request->filled('cuisine')) {
            $query->where('cuisine', $request->cuisine);
        }

        // 📍 Filter by location
        if ($request->filled('location')) {
            $query->where('location', $request->location);
        }

        // ↕ Sorting
        if ($request->filled('sort_by')) {
            $direction = $request->get('sort_order', 'asc');
            $query->orderBy($request->sort_by, $direction);
        }

        // 📄 Pagination (default 10 per page)
        $perPage = $request->get('per_page', 10);

        return response()->json(
            $query->paginate($perPage)
        );
    }

    /**
     * Single restaurant
     */
    public function show($id)
    {
        return response()->json(
            Restaurant::findOrFail($id)
        );
    }
}
