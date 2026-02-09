# Optimization Strategy

## Database Indexing (High Impact)
To ensure the application scales to thousands of orders, we added B-Tree indices to frequently queried columns.

### Why these Indices?
*   **`restaurants.cuisine`**: Allows instant filtering.
*   **`restaurants.location`**: Allows instant filtering.
*   **`orders.ordered_at`**: Optimized for range queries ("Last 7 days").
*   **`orders.order_amount`**: Speeds up price filtering (`WHERE order_amount > 500`).
*   **`orders.restaurant_id`**: Composite index for faster joins.

> **Result:** Queries execute in milliseconds instead of seconds, regardless of dataset size (O(log N)).

## Query Performance
*   **Aggregation in SQL**: We perform all aggregations (`SUM`, `AVG`, `COUNT`) directly in the database engine using SQL. This minimizes the amount of data transferred over the network and processed by PHP, significantly reducing memory usage.
*   **Efficient Filtering**: Filters are applied using `WHERE` clauses, ensuring only relevant rows are processed.
*   **Pagination**: The restaurant list is paginated, fetching only 10 items at a time.

## Frontend Optimization
*   **Server Components**: We leverage Next.js Server Components where possible to reduce client-side JavaScript bundle size.
*   **Optimized Images**: Using `next/image` for automatic image optimization.
*   **Lazy Loading**: Components are loaded only when needed.
