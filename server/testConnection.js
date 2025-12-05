const neo4j = require('neo4j-driver');
const dotenv = require('dotenv');

dotenv.config();

const testConnection = async () => {
  console.log('🔍 Testing Neo4j Connection...\n');
  console.log('URI:', process.env.NEO4J_URI);
  console.log('User:', process.env.NEO4J_USER);
  console.log('Password:', process.env.NEO4J_PASSWORD ? '***' + process.env.NEO4J_PASSWORD.slice(-4) : 'NOT SET');
  console.log('');

  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
  );

  try {
    console.log('⏳ Connecting to Neo4j...');
    const serverInfo = await driver.getServerInfo();
    console.log('✅ Connection successful!');
    console.log('📊 Server Info:');
    console.log('   Address:', serverInfo.address);
    console.log('   Version:', serverInfo.agent);
    console.log('');

    // Test a simple query
    const session = driver.session();
    try {
      console.log('⏳ Testing query...');
      const result = await session.run('RETURN "Hello Neo4j!" as message');
      console.log('✅ Query successful!');
      console.log('   Result:', result.records[0].get('message'));
      console.log('');
      console.log('🎉 Neo4j is ready to use!');
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Check if Neo4j URI is correct');
    console.error('2. Verify username and password');
    console.error('3. Ensure Neo4j instance is running');
    console.error('4. Check firewall/network settings');
  } finally {
    await driver.close();
  }
};

testConnection();
