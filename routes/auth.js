import express from 'express';
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register endpoint
router.post('/register', async (req, res) => {
	try {
		const { email, password, name } = req.body;

		// Validate input
		if (!email || !password || !name) {
			return res.status(400).json({ error: 'Email, password, and name are required' });
		}

		// Check if user already exists
		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ error: 'User with this email already exists' });
		}

		// Create new user
		const user = await User.create({
			email,
			password,
			name,
		});

		// Generate JWT token
		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

		res.status(201).json({
			message: 'User registered successfully',
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		console.error('Register error:', error);
		res.status(500).json({ error: 'An error occurred during registration' });
	}
});

// Login endpoint
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate input
		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}

		// Find user by email
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}

		// Validate password
		const isPasswordValid = await user.validatePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}

		// Generate JWT token
		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

		res.json({
			message: 'Login successful',
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ error: 'An error occurred during login' });
	}
});

// Verify token endpoint
router.post('/verify', (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		const decoded = jwt.verify(token, JWT_SECRET);
		res.json({ valid: true, user: decoded });
	} catch (error) {
		res.status(401).json({ error: 'Invalid token' });
	}
});

export default router;
