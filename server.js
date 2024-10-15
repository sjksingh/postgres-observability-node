const express = require('express');
const cors = require('cors');
const { pool } = require('./db'); // Make sure to export the pool from your db.js file
const currentTimeRouter = require('./routes/currentTime');
const versionRouter = require('./routes/version');
const pgStatsRouter = require('./routes/pgStats');
const indexstatsRouter = require('./routes/indexstats');
const enhancedtablestatsRouter = require('./routes/enhancedtablestats');
const slowQueriesRouter = require('./routes/slowQueries');
const vacuumObservabilityRoute = require('./routes/vacuumObservability');


const app = express();
const port = 3001;

app.use(cors()); // Allow cross-origin requests

// Use the routes
app.use('/api/current-time', currentTimeRouter);
app.use('/api/version', versionRouter);
app.use('/api/pg-stats', pgStatsRouter);
app.use('/api/indexstats', indexstatsRouter);
app.use('/api/enhancedtablestats', enhancedtablestatsRouter);
app.use('/api/slow-queries', slowQueriesRouter);
app.use('/api/vacuum-observability', vacuumObservabilityRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
