const { MongoClient } = require('mongodb');

const uri = 'mongodb://mongo1:27017?replicaSet=rs0';

const dbName = '';

async function testConnection() {
    console.log(`Connecting to ${uri}`);
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to mongo1 successfully');
    } catch (error) {
        console.error('Error connecting to mongo-primary:', error);
    } finally {
        await client.close();
    }
}

testConnection();
