import mongoose from 'mongoose';
import config from '../config';

// Connect to DB
const { mongodb } = config;


export default {
  DB: async function setupDB(dbname?: string): Promise<void> {
    let conn: mongoose.Connection;

    // Empty collections
    async function removeAllCollections(): Promise<void> {
      const collections = Object.keys(conn.collections);
      await Promise.all(collections.map(async (collectionName) => {
        const collection = conn.collections[collectionName];
        await collection.deleteMany({});
      }));
    }

    // Drop collections
    async function dropAllCollections(): Promise<void> {
      const collections = Object.keys(conn.collections);
      await Promise.all(collections.map(async (collectionName) => {
        const collection = conn.collections[collectionName];
        await collection.drop();
      }));
    }

    beforeAll(async (done) => {
      await mongoose.connect(`mongodb://localhost/qodex_test_db_${dbname}`, mongodb.options);
      conn = mongoose.connection;
      await done();
    });

    // after each test
    afterEach(async (done) => {
      await removeAllCollections();
      await done();
    });

    // after npm run test
    afterAll(async (done) => {
      await dropAllCollections();
      await conn.close();
      await mongoose.disconnect();
      await done();
    });
  },
};
