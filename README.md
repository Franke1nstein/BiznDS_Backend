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

### Configuration

Create a `.env` file in the root directory with the appropriate configuration:

```bash
# Environment
NODE_ENV=production
PORT=3000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Choose ONE database option:

# Option 1: PostgreSQL (Supabase, Vercel Postgres, etc.)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Option 2: MySQL (AWS RDS, etc.)
RDS_HOSTNAME=your-host.rds.amazonaws.com
RDS_PORT=3306
RDS_DB_NAME=your_database
RDS_USERNAME=admin
RDS_PASSWORD=your_password
DB_TYPE=mysql

# Option 3: SQLite (local development)
# No additional configuration needed
```

See `.env.example` for all available options.

### Development

```bash
# Start development server with auto-reload
npm run dev

# Server runs on http://localhost:3000
```

### Production

```bash
# Start production server
npm start
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

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Select `E_Commerce_Backend` as root directory
4. Add environment variables (see Configuration)
5. Deploy automatically on every push

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions for multiple platforms (Heroku, AWS, DigitalOcean, etc.)

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

## Testing

```bash
# Run tests (if configured)
npm run test
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run lint` - Run ESLint
- `npm run zip` - Create deployment package

## Environment Variables Reference

See `.env.example` for a complete template with descriptions of all available environment variables.

## Troubleshooting

### Database Connection Issues

- Verify DATABASE_URL format
- Check RDS/server is running and accessible
- Verify security groups/firewall rules
- Check credentials are correct

### CORS Errors

- Verify `FRONTEND_URL` environment variable
- Ensure it includes protocol (http/https)
- No trailing slashes

### Port Already in Use

- Change PORT environment variable
- Or kill process: `lsof -i :3000` (Mac/Linux)

## Contributing

1. Create a feature branch
2. Follow ESLint rules
3. Commit changes with clear messages
4. Push to branch
5. Open a pull request

## API Documentation

Detailed API documentation available in `documentation.md`

## License

ISC

## Support

For issues and questions, refer to the API documentation or create an issue on GitHub.
