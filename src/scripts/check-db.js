const { client, connectDb } = require('../config/db');

(async () => {
  try {
    await connectDb();
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('Tabelas encontradas:', tables.rows.map((row) => row.table_name));
  } catch (error) {
    console.error('Erro ao validar banco:', error.message);
    process.exitCode = 1;
  } finally {
    if (client) {
      await client.end();
    }
  }
})();
