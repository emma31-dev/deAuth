const { sqliteTable, text, integer } = require('drizzle-orm/sqlite-core');

const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  auth_provider: text('auth_provider', { enum: ['email', 'gmail', 'wallet'] }).notNull(),
  identifier: text('identifier').notNull().unique(),
  password: text('password'), // Only for email auth
  nonce: text('nonce'), // Only used for wallet auth
});

module.exports = { users };