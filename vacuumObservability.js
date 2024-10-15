const express = require('express');
const router = express.Router();
const pool = require('../db'); // Ensure this imports the pool correctly

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
       SELECT
    schemaname,
    relname,
    n_live_tup,
    n_dead_tup,
    (n_dead_tup::float / NULLIF(n_live_tup + n_dead_tup, 0)) * 100 AS dead_tuple_ratio
FROM
    pg_stat_all_tables
WHERE
    schemaname NOT IN ('pg_catalog', 'information_schema', 'pg_toast', 'pg_temp_1', 'pg_temp')  -- Exclude system schemas
    AND (n_live_tup + n_dead_tup) > 0  -- Ensure there are tuples to avoid division by zero
    AND (n_dead_tup::float / NULLIF(n_live_tup + n_dead_tup, 0)) * 100 >= 0.00
ORDER BY
    dead_tuple_ratio DESC; 
		`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching vacuum observability data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

