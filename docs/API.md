# API Documentation

## Overview
The backend exposes a RESTful API for querying restaurant data, daily analytics, and top performing restaurants. All endpoints expect and return JSON.

### Base URL
`http://localhost:8000/api`

---

## Endpoints

### 1. List Restaurants
Retrieve a paginated list of all restaurants.

**Request:**
`GET /restaurants`

**Parameters:**
*   `search` (string): Search by name (e.g., "Pizza").
*   `cuisine` (string): Filter by cuisine type.
*   `location` (string): Filter by city.
*   `page` (int): Page number (defaults to 1).

**Response:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 101,
      "name": "Slice of Life",
      "location": "New York",
      "cuisine": "Pizza"
    }
  ],
  "total": 50
}
```

---

### 2. Restaurant Trends (Analytics)
Retrieve detailed performance metrics for a specific restaurant.

**Request:**
`GET /restaurants/{id}/trends`

**Parameters:**
*   `from` (date): Start date (YYYY-MM-DD).
*   `to` (date): End date (YYYY-MM-DD).
*   `min_amount` (int): Minimum order value.
*   `max_amount` (int): Maximum order value.
*   `start_hour` (int): Start hour of day (0-23).
*   `end_hour` (int): End hour of day (0-23).

**Response:**
```json
{
  "daily": [
    { "date": "2025-06-22", "orders": 45, "revenue": "12500" }
  ],
  "average_order_value": 315.50,
  "daily_peak_hours": [
    { "date": "2025-06-22", "hour": "19", "total": 12 }
  ],
  "filtered_orders": [ ... ]
}
```

---

### 3. Top Restaurants
Retrieve the top 3 highest revenue generating restaurants for a given period.

**Request:**
`GET /top-restaurants`

**Parameters:**
*   `from` (date): Start date.
*   `to` (date): End date.
*   `location` (string): Filter by city.

**Response:**
```json
[
  { "name": "Burger King", "orders": 120, "revenue": "54000" },
  { "name": "Pizza Hut", "orders": 95, "revenue": "48000" },
  { "name": "Subway", "orders": 80, "revenue": "32000" }
]
```
