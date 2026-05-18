import express from 'express';
import { Product } from '../models/Product.js';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const search = req.query.search;
		let queryOptions = {};

		if (search) {
			const searchPattern = `%${search}%`;

			queryOptions.where = {
				[Op.or]: [
					{ name: { [Op.iLike]: searchPattern } },
					{ keywords: { [Op.contains]: [search.toLowerCase()] } },
				],
			};
		}

		console.log('extracting products...');
		const products = await Product.findAll(queryOptions);

		return res.status(200).json(products);
	} catch (error) {
		console.error('products outes error :', error.message);

		return res.status(500).json({
			error: 'Failed to load products.',
			details: error.message,
		});
	}
});

export default router;
