import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

export const connectDB = async (uri?: string) => {
  try {
    let dbUri = uri;

    if (process.env.NODE_ENV === 'test') {
      mongoServer = await MongoMemoryServer.create();
      dbUri = mongoServer.getUri();
    }

    const connection = await mongoose.connect(dbUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
