import dns from 'node:dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({
  quiet: true
});

const dnsServers = process.env.DNS_SERVERS?.split(',')
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers?.length) {
  dns.setServers(dnsServers);
}

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI not defined in environment');
    }

    const connection = await mongoose.connect(uri);
    console.log('MongoDB connected');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
