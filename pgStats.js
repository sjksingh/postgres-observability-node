const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    console.log('Executing count query...');
    const countResult = await pool.query('SELECT COUNT(*) FROM pg_stats');
    console.log('Count query result:', countResult.rows[0]);
    const totalCount = parseInt(countResult.rows[0].count);

    console.log('Executing main query...');
    const result = await pool.query(`
     SELECT
    schemaname,
    tablename,
    attname AS column_name,
    null_frac AS null_fraction,
    avg_width AS average_width,
    n_distinct AS distinct_values,
    correlation,
    most_common_vals AS most_common_values,
    most_common_freqs AS most_common_frequencies
FROM
    pg_stats
WHERE
    schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY
    schemaname, tablename 
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    console.log('Main query result rows:', result.rows.length);

    const response = {
      data: result.rows,
      pagination: {
        currentPage: page,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount
      }
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (err) {
    console.error('Error in pgStats route:', err);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: err.message,
      stack: err.stack 
    });
  }
});

module.exports = router;
