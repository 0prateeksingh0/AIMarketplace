# AIMarketplace Backend API

> Modern, scalable RESTful API for AIMarketplace - Multi-vendor E-commerce Platform

Built with Node.js v22+, Express.js, Prisma ORM, and PostgreSQL following industry best practices.

## 🚀 Features

- ✅ **RESTful API** - Clean, predictable API design
- ✅ **Authentication** - JWT-based auth with refresh tokens
- ✅ **Authorization** - Role-based access control
- ✅ **Validation** - Request validation with express-validator
- ✅ **Security** - Helmet, CORS, rate limiting
- ✅ **Error Handling** - Centralized error handling
- ✅ **Logging** - Winston logger with file rotation
- ✅ **Database** - Prisma ORM with PostgreSQL
- ✅ **File Upload** - Multer for image uploads
- ✅ **Payment** - Stripe integration
- ✅ **Email** - Nodemailer for transactional emails
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Compression** - Response compression
- ✅ **TypeScript Ready** - Easy migration path

## 📋 Prerequisites

- Node.js >= 22.0.0
- PostgreSQL >= 14.0
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/aimarketplace"
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Start Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout user

#### Products
- `GET /api/v1/products` - Get all products (paginated, filterable)
- `GET /api/v1/products/:id` - Get single product
- `GET /api/v1/products/categories` - Get all categories
- `POST /api/v1/products` - Create product (auth required)
- `PATCH /api/v1/products/:id` - Update product (auth required)
- `DELETE /api/v1/products/:id` - Delete product (auth required)

#### Stores
- `GET /api/v1/stores` - Get all stores
- `GET /api/v1/stores/:id` - Get single store
- `POST /api/v1/stores` - Create store (auth required)
- `PATCH /api/v1/stores/:id` - Update store (auth required)

#### Orders
- `GET /api/v1/orders` - Get user orders (auth required)
- `GET /api/v1/orders/:id` - Get single order (auth required)
- `POST /api/v1/orders` - Create order (auth required)
- `PATCH /api/v1/orders/:id` - Update order status (auth required)

#### Cart
- `GET /api/v1/cart` - Get user cart (auth required)
- `POST /api/v1/cart` - Add to cart (auth required)
- `PATCH /api/v1/cart/:id` - Update cart item (auth required)
- `DELETE /api/v1/cart/:id` - Remove from cart (auth required)

#### Addresses
- `GET /api/v1/addresses` - Get user addresses (auth required)
- `POST /api/v1/addresses` - Create address (auth required)
- `PATCH /api/v1/addresses/:id` - Update address (auth required)
- `DELETE /api/v1/addresses/:id` - Delete address (auth required)

#### Ratings & Reviews
- `GET /api/v1/ratings` - Get product ratings
- `POST /api/v1/ratings` - Create rating (auth required)

#### Coupons
- `GET /api/v1/coupons` - Get available coupons
- `POST /api/v1/coupons/validate` - Validate coupon code

#### Admin
- `GET /api/v1/admin/dashboard` - Get dashboard stats (admin only)
- `GET /api/v1/admin/stores/pending` - Get pending stores (admin only)
- `PATCH /api/v1/admin/stores/:id/approve` - Approve store (admin only)

### Request Examples

#### Register User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

#### Get Products with Filters

```bash
curl http://localhost:5000/api/v1/products?category=Electronics&page=1&limit=10
```

#### Create Product

```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone model",
    "mrp": 1199,
    "price": 1099,
    "category": "Smartphones",
    "images": ["image1.jpg", "image2.jpg"]
  }'
```

### Response Format

#### Success Response

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

#### Error Response

```json
{
  "status": "error",
  "message": "Error message here"
}
```

#### Paginated Response

```json
{
  "status": "success",
  "message": "Products retrieved successfully",
  "data": {
    "products": [...]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasMore": true
  }
}
```

## 🏗️ Project Structure

```
server/
├── config/              # Configuration files
│   ├── cors.js         # CORS settings
│   ├── database.js     # Prisma client
│   └── logger.js       # Winston logger
├── controllers/         # Route controllers
│   ├── auth.controller.js
│   └── product.controller.js
├── middleware/          # Custom middlewares
│   ├── auth.js         # Authentication
│   ├── errorHandler.js # Error handling
│   ├── rateLimiter.js  # Rate limiting
│   └── validation.js   # Input validation
├── routes/              # API routes
│   ├── auth.routes.js
│   └── product.routes.js
├── utils/               # Utility functions
│   ├── jwt.js          # JWT helpers
│   ├── pagination.js   # Pagination helpers
│   └── response.js     # Response helpers
├── logs/                # Log files
├── uploads/             # Uploaded files
├── .env.example         # Environment variables template
├── package.json
├── server.js            # Entry point
└── README.md

```

## 🔐 Security Best Practices

- ✅ Helmet for security headers
- ✅ CORS configured properly
- ✅ Rate limiting on all routes
- ✅ JWT token expiration
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ Request size limits
- ✅ Error messages don't leak sensitive info

## 🧪 Testing

```bash
npm test
```

## 📊 Logging

Logs are stored in the `logs/` directory:

- `combined.log` - All logs
- `error.log` - Error logs only

Console logs in development mode, file logs in production.

## 🚀 Deployment

### Environment Variables

Ensure all production environment variables are set:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_production_database_url
JWT_SECRET=your_secure_secret
FRONTEND_URL=https://your-frontend-url.com
```

### Start Production Server

```bash
npm start
```

### Using PM2 (Recommended)

```bash
npm install -g pm2
pm2 start server.js --name aimarketplace-api
pm2 save
pm2 startup
```

## 🔧 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@aimarketplace.com

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Built with ❤️ by AIMarketplace Team**

