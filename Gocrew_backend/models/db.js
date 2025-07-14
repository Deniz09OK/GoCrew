const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gocrew',
    password: 'annecha',
    port: 5432,
});

module.exports = pool;
