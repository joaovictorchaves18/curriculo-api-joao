const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

if (!connectionString) {
  throw new Error('DATABASE_URL não foi definida.');
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function connectDb() {
  try {
    await client.connect();
    console.log('Conectado ao PostgreSQL NeonDB.');
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error.message);
    throw error;
  }
}

module.exports = {
  client,
  connectDb,
};
