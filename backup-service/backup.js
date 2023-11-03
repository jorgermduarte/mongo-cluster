const { MongoClient } = require('mongodb');
const fs = require('fs');
const archiver = require('archiver');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const uri = 'mongodb://mongo1:27017?replicaSet=rs0';

async function startBackup() {
    console.log(`Connecting to ${uri}`);
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to mongo-primary successfully');

        const adminDb = client.db().admin();
        const dbList = await adminDb.listDatabases();

        const tempBackupDir = 'temp_backup';
        if (!fs.existsSync(tempBackupDir)) {
            fs.mkdirSync(tempBackupDir);
        }

        const archive = archiver('zip', { zlib: { level: 9 } });
        const output = fs.createWriteStream(`${tempBackupDir}/${uuidv4()}.zip`);

        archive.pipe(output);

        for (const dbInfo of dbList.databases) {
            const dbName = dbInfo.name;
            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();

            console.log(`Collections in ${dbName}:`, collections);

            for (const collection of collections) {
                const collectionName = collection.name;
                const data = await db.collection(collectionName).find().toArray();
                archive.append(JSON.stringify(data), { name: `${dbName}/${collectionName}.json` });
            }
        }

        archive.finalize();

        output.on('close', async () => {
            console.log('Backup archive created');
            await publishBackup(output.path);
        });

    } catch (error) {
        console.error('Error connecting to mongo1:', error);
    } finally {
        await client.close();
    }
}

async function publishBackup(zipFilePath) {
    console.log(` >>> Needs to be implemented: publishBackup(${zipFilePath})`);
}

startBackup();
