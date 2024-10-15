const { Pool } = require('pg');

const pool = new Pool({
  host: 'you-hostname',
  port: 5432,
  user: 'database-user',
  password: 'password',
  database: 'nameofDB',
});

// Export the pool directly
module.exports = pool;

