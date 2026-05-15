/* eslint-disable linebreak-style */
/* eslint-disable indent */

import { DataTypes } from 'sequelize';
import bcryptjs from 'bcryptjs';

export const initUser = (sequelize) => {
	const User = sequelize.define(
		'User',
		{
			id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: { isEmail: true },
			},
			password: { type: DataTypes.STRING, allowNull: false },
			name: { type: DataTypes.STRING, allowNull: false },
			createdAt: { type: DataTypes.DATE(3) },
			updatedAt: { type: DataTypes.DATE(3) },
		},
		{
			hooks: {
				beforeCreate: async (user) => {
					if (user.password) {
						const salt = await bcryptjs.genSalt(10);
						user.password = await bcryptjs.hash(user.password, salt);
					}
				},
				beforeUpdate: async (user) => {
					if (user.changed('password')) {
						const salt = await bcryptjs.genSalt(10);
						user.password = await bcryptjs.hash(user.password, salt);
					}
				},
			},
		}
	);
	// Method to compare passwords
	User.prototype.validatePassword = async function (password) {
		return await bcryptjs.compare(password, this.password);
	};

	return User;
};
