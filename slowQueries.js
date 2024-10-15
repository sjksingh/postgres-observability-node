const express = require('express');
const router = express.Router();
const pool = require('../db'); // Ensure you're importing the pool directly

router.get('/', async (req, res) => {
  console.log('Database pool:', pool); // Log the pool object

  try {
    const result = await pool.query(`
      WITH slow_queries AS (
          SELECT
              queryid,  -- Use queryid here
              query,
              total_exec_time,
              calls,
              rows,
              mean_exec_time,
              shared_blks_hit,
              shared_blks_read,
              shared_blks_dirtied,
              temp_blks_written
          FROM pg_stat_statements
          WHERE total_exec_time > 1000
          AND mean_exec_time > 100
          ORDER BY total_exec_time DESC
          LIMIT 20
      )
      SELECT
          sq.queryid,  -- Use queryid here
          LEFT(sq.query, 100) AS query_preview,
          sq.total_exec_time / 1000.0 AS total_exec_time_seconds,
          sq.calls,
          sq.rows,
          sq.mean_exec_time / 1000.0 AS mean_exec_time_seconds,
          CASE
              WHEN sq.shared_blks_read > sq.shared_blks_hit THEN 'High disk reads'
              WHEN sq.temp_blks_written > 0 THEN 'Uses temp files'
              WHEN sq.shared_blks_dirtied > sq.shared_blks_hit / 10 THEN 'High buffer dirtying'
              WHEN sq.mean_exec_time > 1000 THEN 'Generally slow execution'
              WHEN sq.calls = 1 AND sq.total_exec_time > 10000 THEN 'Single long-running query'
              ELSE 'Needs further investigation'
          END AS probable_cause
      FROM slow_queries sq;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching slow queries:', error); // Log the full error object
    res.status(500).json({ error: 'Failed to fetch slow queries.' });
  }
});

module.exports = router;
