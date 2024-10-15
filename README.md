# postgres-observability-node

This project provides a Node.js-based observability solution for PostgreSQL databases, allowing users to monitor and analyze database performance through a web-based UI.

## Installation

Run the following commands to set up the project:

```bash
npm init -y
npm install express pg cors
```

## Project Structure

```
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
```

## Starting the Node Server

To start the server, run:

```bash
node server.js
```

## API Endpoints

You can access the following API endpoints using cURL or a web browser:

### Using cURL

```bash
curl -s http://localhost:3001/api/Version
curl -s http://localhost:3001/api/pg-stats | jq
curl -s http://localhost:3001/api/vacuum-observability
curl -s http://localhost:3001/api/slow-queries | jq
curl -s http://localhost:3001/api/enhancedtablestats | jq
curl -s http://localhost:3001/api/indexstats | jq 
```

### Using a Web Browser

- http://localhost:3001/api/Version
- http://localhost:3001/api/pg-stats
- http://localhost:3001/api/vacuum-observability
- http://localhost:3001/api/slow-queries
- http://localhost:3001/api/enhancedtablestats
- http://localhost:3001/api/indexstats

## Visual Diagram

+----------------+     HTTP     +----------------+
|                |  Requests    |                |
| Client Browser | -----------> | Node.js Server |
|                |              |                |
+----------------+              +--------+-------+
                                         |
                                         | Database
                                         | Queries
                                         |
                                +--------v-------+
                                |                |
                                |   PostgreSQL   |
                                |   Database     |
                                |                |
                                +----------------+


Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
This project is licensed under the MIT License.


