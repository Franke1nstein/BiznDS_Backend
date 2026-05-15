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

const allowedOrigins =
	process.env.FRONTEND_URL ?
		[process.env.FRONTEND_URL]
	:	['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Bloqué par la politique CORS de Production'));
		}
	},
	credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve images from the images folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/delivery-options', deliveryOptionRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/payment-summary', paymentSummaryRoutes);
app.use('/api/auth', authRoutes);

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve index.html for any unmatched routes
app.get('*', (req, res) => {
	const indexPath = path.join(__dirname, 'dist', 'index.html');
	if (fs.existsSync(indexPath)) {
		res.sendFile(indexPath);
	} else {
		res.status(404).send('index.html not found');
	}
});

// Error handling middleware
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something went wrong!' });
});
/* eslint-enable no-unused-vars */

// 2. INITIALISATION of the database

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
		console.error("Erreur lors de l'initialisation de la base de données :", error);
	}
}

// initialisation start
initializeDatabase();

if (process.env.NODE_ENV !== 'production') {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}

export default app;
