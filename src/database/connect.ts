import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose"
import logger from '../utils/logger';

const MONGODB_URL = (process.env.MONGODB_URL) as string

async function connect() {
  try {
    await mongoose.connect(MONGODB_URL);
      logger.info("Connected to db");
  } catch (err) {
    logger.error("Can't connect to database");
    process.exit(1);
  }
}

export = connect;