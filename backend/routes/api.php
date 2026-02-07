<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RestaurantController;
use App\Http\Controllers\Api\AnalyticsController;

Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);
Route::get('/restaurants/{id}/trends', [AnalyticsController::class, 'restaurantTrends']);
Route::get('/top-restaurants', [AnalyticsController::class, 'topRestaurants']);