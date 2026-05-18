import { Sequelize } from 'sequelize';
import sqlJsAsSqlite3 from 'sql.js-as-sqlite3';
import fs from 'fs';
import { initUser } from './User.js';
import { initOrder } from './Order.js';
import { initCartItem } from './CartItem.js';

// Check for different connection methods
const hasDatabaseUrl = !!import.meta.env.DATABASE_URL;
const isUsingRDS =
	import.meta.env.RDS_HOSTNAME && import.meta.env.RDS_USERNAME && import.meta.env.RDS_PASSWORD;
const dbType = import.meta.env.DB_TYPE || 'mysql';
const defaultPorts = {
	mysql: 3306,
	postgres: 5432,
};
const defaultPort = defaultPorts[dbType];

export let sequelize;

// Priority 1: DATABASE_URL (Supabase, Vercel, Heroku style)
if (hasDatabaseUrl) {
	sequelize = new Sequelize(import.meta.env.DATABASE_URL, {
		dialect: 'postgres',
		logging: false,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	});
}
// Priority 2: RDS style env vars
else if (isUsingRDS) {
	sequelize = new Sequelize({
		database: import.meta.env.RDS_DB_NAME,
		username: import.meta.env.RDS_USERNAME,
		password: import.meta.env.RDS_PASSWORD,
		host: import.meta.env.RDS_HOSTNAME,
		port: import.meta.env.RDS_PORT || defaultPort,
		dialect: dbType,
		logging: false,
	});
}
// Priority 3: Local SQLite
else {
	sequelize = new Sequelize({
		dialect: 'sqlite',
		dialectModule: sqlJsAsSqlite3,
		logging: false,
	});

	// Save database to file after write operations.
	sequelize.addHook('afterCreate', saveDatabaseToFile);
	sequelize.addHook('afterDestroy', saveDatabaseToFile);
	sequelize.addHook('afterUpdate', saveDatabaseToFile);
	sequelize.addHook('afterSave', saveDatabaseToFile);
	sequelize.addHook('afterUpsert', saveDatabaseToFile);
	sequelize.addHook('afterBulkCreate', saveDatabaseToFile);
	sequelize.addHook('afterBulkDestroy', saveDatabaseToFile);
	sequelize.addHook('afterBulkUpdate', saveDatabaseToFile);
}
const User = initUser(sequelize);
const Order = initOrder(sequelize);
const CartItem = initCartItem(sequelize);
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });
export async function saveDatabaseToFile() {
	const dbInstance = await sequelize.connectionManager.getConnection();
	const binaryArray = dbInstance.database.export();
	const buffer = Buffer.from(binaryArray);
	fs.writeFileSync('database.sqlite', buffer);
}

export { User, Order, CartItem };
