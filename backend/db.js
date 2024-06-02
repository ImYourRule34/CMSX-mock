const { pool, Pool } = require('pg');

const pool = new Pool({
    user: 'cmsx_user',
    host: 'localhost',
    database: 'cmsx',
    password: 'your_password',
    port: 5432,
});

module.exports = pool;