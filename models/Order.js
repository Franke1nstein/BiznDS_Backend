import { DataTypes } from 'sequelize';

export const initOrder = (sequelize) => {
	return sequelize.define(
		'Order',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			orderTimeMs: {
				type: DataTypes.BIGINT,
				allowNull: false,
			},
			totalCostCents: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			products: {
				type: DataTypes.JSON,
				allowNull: false,
			},
			createdAt: {
				type: DataTypes.DATE(3),
			},
			updatedAt: {
				type: DataTypes.DATE(3),
			},
		},
		{
			defaultScope: {
				order: [['createdAt', 'DESC']],
			},
		}
	);
};
