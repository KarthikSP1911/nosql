const neo4j = require('neo4j-driver');

let driver;

const connectNeo4j = async () => {
  try {
    const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';

    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    // Verify connectivity
    const serverInfo = await driver.getServerInfo();
    console.log(`Neo4j Connected: ${serverInfo.address}`);
    console.log(`Neo4j Version: ${serverInfo.agent}`);

    // Create constraints and indexes
    await createConstraintsAndIndexes();

    return driver;
  } catch (error) {
    console.error(`Neo4j Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const createConstraintsAndIndexes = async () => {
  const session = driver.session();
  try {
    // Create unique constraints
    await session.run(`
      CREATE CONSTRAINT student_email_unique IF NOT EXISTS
      FOR (s:Student) REQUIRE s.email IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT faculty_email_unique IF NOT EXISTS
      FOR (f:Faculty) REQUIRE f.email IS UNIQUE
    `);

    await session.run(`
      CREATE CONSTRAINT course_code_unique IF NOT EXISTS
      FOR (c:Course) REQUIRE c.code IS UNIQUE
    `);

    // Create indexes for better performance
    await session.run(`
      CREATE INDEX student_id_index IF NOT EXISTS
      FOR (s:Student) ON (s.id)
    `);

    await session.run(`
      CREATE INDEX faculty_id_index IF NOT EXISTS
      FOR (f:Faculty) ON (f.id)
    `);

    await session.run(`
      CREATE INDEX course_id_index IF NOT EXISTS
      FOR (c:Course) ON (c.id)
    `);

    console.log('Neo4j constraints and indexes created successfully');
  } catch (error) {
    console.error('Error creating constraints:', error.message);
  } finally {
    await session.close();
  }
};

const getDriver = () => {
  if (!driver) {
    throw new Error('Neo4j driver not initialized. Call connectNeo4j() first.');
  }
  return driver;
};

const closeConnection = async () => {
  if (driver) {
    await driver.close();
    console.log('Neo4j connection closed');
  }
};

module.exports = {
  connectNeo4j,
  getDriver,
  closeConnection,
};
