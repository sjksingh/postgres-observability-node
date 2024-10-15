const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT
    n.nspname AS schemaname,
    t.relname AS tablename,
    a.attname AS columnname,
    i.relname AS indexname,
    ix.indexdef AS index_definition,
    am.amname AS index_type,
    COALESCE(s.idx_scan, 0) AS scans  -- Number of index scans
FROM
    pg_class t
JOIN pg_index idx ON t.oid = idx.indrelid
JOIN pg_class i ON i.oid = idx.indexrelid
JOIN pg_namespace n ON t.relnamespace = n.oid
JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(idx.indkey)
JOIN pg_indexes ix ON i.relname = ix.indexname
JOIN pg_am am ON i.relam = am.oid
LEFT JOIN pg_stat_all_indexes s ON i.oid = s.indexrelid
WHERE
    n.nspname <> ALL (ARRAY['pg_catalog', 'rds_tools'])  -- Replace with your schema name as needed
ORDER BY
    t.relname, i.relname  
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
