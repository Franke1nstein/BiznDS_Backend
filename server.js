import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';
import productRoutes from './routes/products.js';
import deliveryOptionRoutes from './routes/deliveryOptions.js';
import cartItemRoutes from './routes/cartItems.js';
import orderRoutes from './routes/orders.js';
import resetRoutes from './routes/reset.js';
import paymentSummaryRoutes from './routes/paymentSummary.js';
import authRoutes from './routes/auth.js';
import { Product } from './models/Product.js';
import { DeliveryOption } from './models/DeliveryOption.js';
import { CartItem, Order } from './models/index.js';
import { defaultProducts } from './defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from './defaultData/defaultDeliveryOptions.js';
import { defaultCart } from './defaultData/defaultCart.js';
import { defaultOrders } from './defaultData/defaultOrders.js';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CORS CONFIGURATION ---
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

if (process.env.FRONTEND_URL) {
	allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
	optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// --- Dir path secure ---

const imagesPath = path.join(__dirname, 'images');
if (fs.existsSync(imagesPath)) {
	app.use('/images', express.static(imagesPath));
}

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
	app.use(express.static(distPath));
}

// Routes API
app.use('/api/products', productRoutes);
app.use('/api/delivery-options', deliveryOptionRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/payment-summary', paymentSummaryRoutes);
app.use('/api/auth', authRoutes);

app.get('*', (req, res) => {
	const indexPath = path.join(__dirname, 'dist', 'index.html');
	if (fs.existsSync(indexPath)) {
		res.sendFile(indexPath);
	} else {
		res.status(404).json({ message: 'API Backend operate. Route not found.' });
	}
});

// Middleware for erro handling
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
	console.error('Erreur serveur capturée :', err.stack);
	res.status(500).json({ error: 'Something went wrong!' });
});
/* eslint-enable no-unused-vars */

// --- database initialisation ---
async function initializeDatabase() {
	try {
		await sequelize.sync();

		const productCount = await Product.count();
		if (productCount === 0) {
			const timestamp = Date.now();

			const productsWithTimestamps = defaultProducts.map((product, index) => ({
				...product,
				createdAt: new Date(timestamp + index),
				updatedAt: new Date(timestamp + index),
			}));

			const deliveryOptionsWithTimestamps = defaultDeliveryOptions.map((option, index) => ({
				...option,
				createdAt: new Date(timestamp + index),
				updatedAt: new Date(timestamp + index),
			}));

			const cartItemsWithTimestamps = defaultCart.map((item, index) => ({
				...item,
				createdAt: new Date(timestamp + index),
				updatedAt: new Date(timestamp + index),
			}));

			const ordersWithTimestamps = defaultOrders.map((order, index) => ({
				...order,
				createdAt: new Date(timestamp + index),
				updatedAt: new Date(timestamp + index),
			}));

			await Product.bulkCreate(productsWithTimestamps);
			await DeliveryOption.bulkCreate(deliveryOptionsWithTimestamps);
			await CartItem.bulkCreate(cartItemsWithTimestamps);
			await Order.bulkCreate(ordersWithTimestamps);

			console.log('Default data added to the database.');
		}
	} catch (error) {
		console.error('error when initializing database :', error.message);
	}
}

initializeDatabase().catch((err) => console.error('Database initialization failed:', err));

if (process.env.NODE_ENV !== 'production') {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}

export default app;
