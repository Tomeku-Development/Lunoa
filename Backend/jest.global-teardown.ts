module.exports = async () => {
  const pool = (global as any).__DB_POOL__;
  if (pool) {
    await pool.end();
    console.log('\n[GlobalTeardown] Database pool closed.');
  }
};
