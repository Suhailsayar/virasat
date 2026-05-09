const mysql2 = require('mysql2/promise');
require('dotenv').config();

const pool = mysql2.createPool({
  socketPath:         '/tmp/mysql.sock',
  user:               'root',
  password:           'suhailsayar',
  database:           'virasat_connect',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅  MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌  MySQL connection failed:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;
