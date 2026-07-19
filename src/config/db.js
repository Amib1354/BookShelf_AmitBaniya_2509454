import { fileURLToPath } from 'node:url';
import dns from 'node:dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({
  path: fileURLToPath(new URL('../../.env', import.meta.url)),
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
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in backend/.env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB successfully connected!');
  } catch (error) {
    console.log(`MongoDB cannot be connected ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
