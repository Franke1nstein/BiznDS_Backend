## E-Commerce Backend API

A production-ready backend API for an e-commerce application built with Express.js, Sequelize ORM, and support for PostgreSQL, MySQL, and SQLite databases.

## Features

- 🚀 RESTful API with Express.js
- 🔐 JWT authentication
- 📦 Product management
- 🛒 Shopping cart functionality
- 📋 Order management
- 🚚 Delivery options
- 💾 Multiple database support (PostgreSQL, MySQL, SQLite)
- 🔄 CORS configuration
- 📝 Comprehensive error handling

## Tech Stack

- **Express.js** - Web framework
- **Sequelize** - ORM for database management
- **PostgreSQL/MySQL/SQLite** - Database options
- **JWT** - Authentication
- **bcryptjs** - Password encryption
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js 22+
- npm or yarn
- One of: PostgreSQL, MySQL, or SQLite

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd E_Commerce_Backend

# Install dependencies
npm install
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products?search=keyword` - Search products

### Cart Items

- `GET /api/cart-items` - Get all cart items
- `POST /api/cart-items` - Add item to cart
- `PUT /api/cart-items/:productId` - Update cart item
- `DELETE /api/cart-items/:productId` - Remove from cart

### Delivery Options

- `GET /api/delivery-options` - Get available delivery options
- `GET /api/delivery-options?expand=estimatedDeliveryTime` - Get with delivery times

### Orders

- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order details

### Payment

- `GET /api/payment-summary` - Get payment summary

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Admin

- `POST /api/reset` - Reset database to default state

## Database Support

### PostgreSQL (Recommended for Production)

- Scalable and reliable
- Supported by Vercel, Supabase, AWS RDS
- Set `DATABASE_URL` environment variable

### MySQL

- Good for traditional hosting
- AWS RDS, DigitalOcean, etc.
- Configure with `RDS_*` environment variables

### SQLite

- Perfect for development and testing
- Uses `sql.js-as-sqlite3` for in-memory and file-based storage
- Database persisted in `database.sqlite`

## Project Structure

```
src/
├── routes/           # API route handlers
├── models/           # Sequelize models
├── middleware/       # Express middleware (auth, etc.)
├── defaultData/      # Initial database seed data
├── backend/          # JSON storage for SQLite
├── images/           # Static image files
└── server.js         # Main server file
```


## Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection configured per environment
- ✅ Input validation on API endpoints
- ✅ Environment variables for sensitive data
- ✅ Error handling without exposing sensitive details

## Performance Considerations

- Connection pooling for database
- Efficient queries with proper indexing
- Caching strategies for product listings
- Pagination for large datasets
- Compression middleware


## Troubleshooting

### Database Connection Issues

- Verify DATABASE_URL format
- Check RDS/server is running and accessible
- Verify security groups/firewall rules
- Check credentials are correct

