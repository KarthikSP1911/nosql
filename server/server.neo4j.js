const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectNeo4j, closeConnection } = require('./config/neo4j');
const { errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();

// Initialize Neo4j connection
connectNeo4j();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes - Using Neo4j controllers
app.use('/api/students', require('./routes/studentRoutes.neo4j'));
app.use('/api/faculty', require('./routes/facultyRoutes.neo4j'));
app.use('/api/courses', require('./routes/courseRoutes.neo4j'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await closeConnection();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await closeConnection();
    process.exit(0);
  });
});
