# 📊 Pagination Documentation

## Overview

This document describes the comprehensive pagination system implemented across all API endpoints in AIMarketplace.

## 🎯 Features

- **Flexible Pagination**: Customizable page size and current page
- **Sorting**: Sort by multiple fields in ascending or descending order
- **Filtering**: Filter results based on various criteria
- **Search**: Full-text search across multiple fields
- **Metadata**: Complete pagination information in responses
- **Links**: HATEOAS-style navigation links
- **Performance**: Optimized database queries with proper indexing

## 📝 Query Parameters

### Pagination Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Integer | 1 | Current page number (starts from 1) |
| `limit` | Integer | 10 | Number of items per page (max: 100) |

### Sorting Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sortBy` | String | varies | Field to sort by |
| `order` | String | 'desc' | Sort order: 'asc' or 'desc' |

### Search & Filter Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` or `q` | String | Search query |
| `category` | String | Filter by category |
| `status` | String | Filter by status |
| `minPrice` | Number | Minimum price filter |
| `maxPrice` | Number | Maximum price filter |

## 📊 Response Format

All paginated endpoints return responses in this format:

```json
{
  "status": "success",
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      // ... array of items
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasMore": true,
    "hasPrev": false,
    "hasNext": true,
    "prevPage": null,
    "nextPage": 2,
    "firstPage": 1,
    "lastPage": 10,
    "from": 1,
    "to": 10
  },
  "links": {
    "self": "/api/v1/products?page=1&limit=10",
    "first": "/api/v1/products?page=1&limit=10",
    "last": "/api/v1/products?page=10&limit=10",
    "next": "/api/v1/products?page=2&limit=10"
  }
}
```

## 🔗 Paginated Endpoints

### Products

**GET** `/api/v1/products`

Query Parameters:
- `page` - Page number
- `limit` - Items per page
- `sortBy` - Sort field: `name`, `price`, `createdAt`
- `order` - Sort order: `asc`, `desc`
- `category` - Filter by category
- `search` - Search in name/description
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `storeId` - Filter by store
- `inStock` - Filter in-stock items

**Example:**
```bash
GET /api/v1/products?page=2&limit=20&sortBy=price&order=asc&category=Electronics&minPrice=100&maxPrice=1000
```

### Orders

**GET** `/api/v1/orders` (User orders)

Query Parameters:
- `page` - Page number
- `limit` - Items per page
- `sortBy` - Sort field: `createdAt`, `total`, `status`
- `order` - Sort order
- `status` - Filter by order status
- `storeId` - Filter by store
- `isPaid` - Filter paid/unpaid orders

**Example:**
```bash
GET /api/v1/orders?page=1&limit=10&status=SHIPPED&sortBy=createdAt&order=desc
```

**GET** `/api/v1/orders/store` (Store orders)

Same parameters as user orders, filtered for store owner's orders.

### Stores

**GET** `/api/v1/stores`

Query Parameters:
- `page` - Page number
- `limit` - Items per page
- `sortBy` - Sort field: `name`, `createdAt`, `username`
- `order` - Sort order
- `search` - Search in name/description/username

**Example:**
```bash
GET /api/v1/stores?page=1&limit=20&search=electronics&sortBy=name&order=asc
```

### Ratings

**GET** `/api/v1/ratings`

Query Parameters:
- `page` - Page number
- `limit` - Items per page
- `productId` - Filter by product
- `userId` - Filter by user
- `sortBy` - Sort field: `rating`, `createdAt`
- `order` - Sort order

### Addresses

**GET** `/api/v1/addresses`

Query Parameters:
- `page` - Page number
- `limit` - Items per page

## 💡 Usage Examples

### Example 1: Basic Pagination

```bash
# Get first page with 10 items (default)
curl http://localhost:5000/api/v1/products

# Get second page with 20 items
curl http://localhost:5000/api/v1/products?page=2&limit=20
```

### Example 2: Sorting

```bash
# Sort products by price (ascending)
curl http://localhost:5000/api/v1/products?sortBy=price&order=asc

# Sort orders by date (descending - newest first)
curl http://localhost:5000/api/v1/orders?sortBy=createdAt&order=desc
```

### Example 3: Filtering

```bash
# Filter products by category and price range
curl "http://localhost:5000/api/v1/products?category=Electronics&minPrice=100&maxPrice=500"

# Filter orders by status
curl "http://localhost:5000/api/v1/orders?status=DELIVERED&isPaid=true"
```

### Example 4: Search

```bash
# Search products
curl "http://localhost:5000/api/v1/products?search=iphone"

# Search stores
curl "http://localhost:5000/api/v1/stores?search=tech"
```

### Example 5: Combined Query

```bash
# Complex query with pagination, sorting, filtering, and search
curl "http://localhost:5000/api/v1/products?page=1&limit=20&sortBy=price&order=asc&category=Smartphones&minPrice=300&maxPrice=1200&search=samsung&inStock=true"
```

### Example 6: Using Response Metadata

```javascript
// Frontend example (React/Next.js)
const fetchProducts = async (page = 1) => {
  const response = await fetch(`/api/v1/products?page=${page}&limit=20`);
  const result = await response.json();
  
  // Access data
  const products = result.data.products;
  
  // Access pagination info
  const { 
    totalPages, 
    hasMore, 
    hasNext, 
    nextPage 
  } = result.pagination;
  
  // Use links for navigation
  const nextUrl = result.links?.next;
  
  return { products, pagination: result.pagination };
};
```

## 🎨 Frontend Integration

### React/Next.js Example

```javascript
import { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/products?page=${page}&limit=20`);
      const data = await res.json();
      
      setProducts(data.data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Product Grid */}
      <div className="grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button 
          onClick={() => setPage(p => p - 1)} 
          disabled={!pagination.hasPrev}
        >
          Previous
        </button>
        
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        
        <button 
          onClick={() => setPage(p => p + 1)} 
          disabled={!pagination.hasNext}
        >
          Next
        </button>
      </div>

      {/* Results Info */}
      <p>
        Showing {pagination.from} to {pagination.to} of {pagination.total} results
      </p>
    </div>
  );
}
```

## ⚡ Performance Optimization

### Database Indexes

Ensure these indexes exist for optimal performance:

```prisma
// Product indexes
@@index([category])
@@index([price])
@@index([createdAt])
@@index([storeId])

// Order indexes
@@index([userId])
@@index([storeId])
@@index([status])
@@index([createdAt])

// Store indexes
@@index([username])
@@index([isActive, status])
```

### Caching Strategy

Consider caching paginated responses:

```javascript
// Redis cache example
const cacheKey = `products:${page}:${limit}:${category}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

// Fetch from database
const data = await fetchFromDatabase();

// Cache for 5 minutes
await redis.setex(cacheKey, 300, JSON.stringify(data));

return data;
```

## 🔒 Security Considerations

1. **Limit Maximum Page Size**: Max limit is 100 items
2. **Validate Input**: All parameters are validated
3. **Rate Limiting**: Pagination requests are rate-limited
4. **SQL Injection**: Prevented by Prisma ORM
5. **Resource Limiting**: Large offset values are handled efficiently

## 📈 Best Practices

1. **Always provide pagination metadata** in responses
2. **Use cursor-based pagination** for real-time data (future enhancement)
3. **Cache frequently accessed pages**
4. **Implement virtual scrolling** for large datasets
5. **Show total count** unless it impacts performance
6. **Provide clear navigation** with links
7. **Handle edge cases** (empty results, last page, etc.)
8. **Optimize database queries** with proper indexes
9. **Consistent response format** across all endpoints
10. **Document all query parameters** clearly

## 🚀 Future Enhancements

- [ ] Cursor-based pagination for real-time feeds
- [ ] GraphQL pagination support
- [ ] Elasticsearch integration for advanced search
- [ ] Redis caching layer
- [ ] Pagination analytics
- [ ] Custom page size per user preference
- [ ] Deep pagination optimization

## 📚 Additional Resources

- [REST API Pagination Best Practices](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/)
- [Prisma Pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination)
- [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)

---

**Last Updated**: $(date)
**Status**: Production-Ready

