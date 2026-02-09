# Kitchen Spurs Analytics Dashboard 🚀

A full-stack analytics dashboard for restaurant performance tracking, built with **Laravel 12 (Backend)** and **Next.js 15 (Frontend)**. This application allows users to visualize daily trends (orders, revenue), identify peak hours, and filter data by multiple criteria.

## 🌟 Features

*   **Global Dashboard:** View all restaurants at a glance.
*   **Detailed Analytics:** Click on any restaurant to see in-depth performance metrics.
*   **Interactive Charts:** Visualize Daily Orders & Revenue trends.
*   **Peak Hour Detection:** Automatically calculates the busiest hour for each day.
*   **Top Restaurants:** Leaderboard of top 3 performing restaurants.
*   **Advanced Filtering:** Filter by Date Range, Order Amount (Min/Max), and Time of Day (Start/End Hour).
*   **Optimized Performance:** Uses Database Indices and efficient SQL aggregation for fast queries.

---

## 🛠 Tech Stack

*   **Backend:** Laravel 12, PHP 8.2+, MySQL 8.0
*   **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, Recharts
*   **Database:** MySQL (Production), SQLite (Local Dev - optional)

---

## 🚀 Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   PHP (v8.2+)
*   Composer
*   MySQL Server

### 1. Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

**Configure Database:**
Update `.env` with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kitchenspurs
DB_USERNAME=root
DB_PASSWORD=yourpassword
```

**Run Migrations & Seed Data:**
```bash
php artisan migrate --seed
```
*This will create the tables and populate them with the sample data provided.*

**Start Server:**
```bash
php artisan serve
```
Backend will run at: `http://localhost:8000`

### 2. Frontend Setup (Next.js)

```bash
cd frontend
npm install
```

**Configure API URL:**
Create a `.env.local` file (optional, defaults to localhost:8000):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Start Server:**
```bash
npm run dev
```
Frontend will run at: `http://localhost:3000`

---

## 📡 API Endpoints

### 1. List Restaurants
`GET /api/restaurants`
*   Returns a paginated list of restaurants.
*   Supports search: `?search=Pizza`
*   Supports filtering: `?cuisine=Italian&location=New York`

### 2. Restaurant Analytics (Trends)
`GET /api/restaurants/{id}/trends`
*   Returns aggregated daily stats, peak hours, and filtered order lists.
*   **Parameters:**
    *   `from` (YYYY-MM-DD)
    *   `to` (YYYY-MM-DD)
    *   `min_amount` (int)
    *   `max_amount` (int)
    *   `start_hour` (int: 0-23)
    *   `end_hour` (int: 0-23)

### 3. Top Restaurants
`GET /api/top-restaurants`
*   Returns top 3 restaurants by revenue for the selected date range.

---

## 🧪 Optimizations

*   **Database Indexing:** Added indices on `cuisine`, `location`, `ordered_at`, and `order_amount` columns to ensure queries remain fast ($O(\log N)$) even with large datasets.
*   **SQL Aggregation:** All calculations (sums, counts, averages, peak hours) are performed directly in the database query to minimize memory usage and processing time in PHP.
*   **Efficient Filtering:** Queries use direct `WHERE` clauses and properly handle conditional filters.

---

## 📷 Screenshots
*(Include screenshots of Dashboard and Analytics page here)*

---

### Author
Mayur Dhavale
