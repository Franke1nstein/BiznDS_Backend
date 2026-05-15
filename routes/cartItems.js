import express from 'express';
import { CartItem } from '../models/index.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 1. Protect all cart routes
router.use(authenticateToken);

router.get('/', async (req, res) => {
	const expand = req.query.expand;
	const userId = req.user.id; // Get ID from token

	// 2. ONLY find items for this specific user
	let cartItems = await CartItem.findAll({ where: { userId } });

	if (expand === 'product') {
		cartItems = await Promise.all(
			cartItems.map(async (item) => {
				const product = await Product.findByPk(item.productId);
				return {
					...item.toJSON(),
					product,
				};
			})
		);
	}

	res.json(cartItems);
});

router.post('/', async (req, res) => {
	const { productId, quantity } = req.body;
	const userId = req.user.id; // Get ID from token

	const product = await Product.findByPk(productId);
	if (!product) {
		return res.status(400).json({ error: 'Product not found' });
	}

	if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
		return res.status(400).json({ error: 'Quantity must be a number between 1 and 10' });
	}

	// 3. Look for item belonging ONLY to this user
	let cartItem = await CartItem.findOne({ where: { productId, userId } });

	if (cartItem) {
		cartItem.quantity += quantity;
		await cartItem.save();
	} else {
		cartItem = await CartItem.create({
			productId,
			quantity,
			userId,
			deliveryOptionId: '1',
		});
	}

	res.status(201).json(cartItem);
});

router.put('/:productId', async (req, res) => {
	const { productId } = req.params;
	const { quantity, deliveryOptionId } = req.body;
	const userId = req.user.id;

	// 5. Ensure you are updating the correct user's item
	const cartItem = await CartItem.findOne({ where: { productId, userId } });
	if (!cartItem) {
		return res.status(404).json({ error: 'Cart item not found' });
	}

	if (quantity !== undefined) {
		if (typeof quantity !== 'number' || quantity < 1) {
			return res.status(400).json({ error: 'Quantity must be a number greater than 0' });
		}
		cartItem.quantity = quantity;
	}

	if (deliveryOptionId !== undefined) {
		const deliveryOption = await DeliveryOption.findByPk(deliveryOptionId);
		if (!deliveryOption) {
			return res.status(400).json({ error: 'Invalid delivery option' });
		}
		cartItem.deliveryOptionId = deliveryOptionId;
	}

	await cartItem.save();
	res.json(cartItem);
});

router.delete('/:productId', async (req, res) => {
	const { productId } = req.params;
	const userId = req.user.id;

	// 6. Ensure you only delete the active user's item
	const cartItem = await CartItem.findOne({ where: { productId, userId } });
	if (!cartItem) {
		return res.status(404).json({ error: 'Cart item not found' });
	}

	await cartItem.destroy();
	res.status(204).send();
});

export default router;
