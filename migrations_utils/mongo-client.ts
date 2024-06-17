import { MongoClient, Db } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

export const getDb = async (): Promise<Db> => {
  const mongoUrl = process.env.MONGODB_URL || ''
  const client = await MongoClient.connect(mongoUrl)
  return client.db()
}
