const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
    pg_stats.schemaname,
    pg_stats.tablename,
    pg_stats.attname,
    pg_catalog.format_type(attr.atttypid, attr.atttypmod) AS data_type,
    pg_stats.null_frac,
    pg_stats.n_distinct AS cardinality,
    CASE
        WHEN (1::double precision - pg_stats.null_frac) = 0::double precision THEN NULL::double precision
        ELSE pg_stats.n_distinct / (1::double precision - pg_stats.null_frac)
    END AS selectivity,
    to_char(pg_class.reltuples, 'FM999999999999999999'::text) AS estimated_rows,
    COALESCE(index_info.relname, 'No Index'::name) AS index_name,
    CASE WHEN idx.indisunique THEN 'Unique' ELSE 'Non-Unique' END AS index_type,
    CASE
        WHEN index_info.relname IS NULL AND COALESCE(pg_stats.n_distinct / (1 - pg_stats.null_frac), 0) > 1000 THEN 'Consider Adding Index'
        WHEN index_info.relname IS NOT NULL THEN 'Index Present'
        ELSE 'Low Selectivity'
    END AS recommended_index
FROM
    pg_stats
JOIN
    pg_class ON pg_class.relname = pg_stats.tablename
               AND pg_class.relnamespace = (SELECT pg_namespace.oid
                                             FROM pg_namespace
                                             WHERE pg_namespace.nspname = pg_stats.schemaname)
LEFT JOIN
    pg_attribute attr ON attr.attrelid = pg_class.oid AND attr.attname = pg_stats.attname
LEFT JOIN
    pg_index idx ON idx.indrelid = pg_class.oid AND (attr.attnum = ANY (idx.indkey::smallint[]))
LEFT JOIN
    pg_class index_info ON index_info.oid = idx.indexrelid
WHERE
    pg_stats.schemaname <> ALL (ARRAY['pg_catalog', 'rds_tools'])
    AND pg_stats.n_distinct > 0
ORDER BY
    selectivity DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
