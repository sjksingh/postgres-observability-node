# postgres-observability-node
This project provides a Node.js-based observability solution for PostgreSQL databases, allowing users to monitor and analyze database performance through a web-based UI.

Install: 
npm init -y
npm install express pg cors



project-root/
│
├── server.js
├── db.js
├── index.html
├── package.json
├── package-lock.json
├── routes/
│   └── (API route files)
├── node_modules/
└── README.md


Start Node:
node server.js


List of APIs....
curl -s http://localhost:3001/api/Version
curl -s http://localhost:3001/api/pg-stats | jq
curl -s http://localhost:3001/api/vacuum-observability
curl -s http://localhost:3001/api/slow-queries | jq
curl -s http://localhost:3001/api/enhancedtablestats | jq
curl -s http://localhost:3001/api/indexstats | jq 




Browser:
http://localhost:3001/api/Version
http://localhost:3001/api/pg-stats
http://localhost:3001/api/vacuum-observability
http://localhost:3001/api/slow-queries
http://localhost:3001/api/enhancedtablestats
http://localhost:3001/api/indexstats





