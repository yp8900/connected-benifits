import { getDb } from '../migrations_utils/mongo-client'
import * as data from './../src/user-consent/data/ui-content.json'

export async function up(): Promise<void> {
  const db = await getDb()
  await db.collection('cb_ui_content').insertMany(data)
}

export async function down(): Promise<void> {
  const db = await getDb()
  await db.collection('cb_ui_content').deleteMany({})
}

export const description = 'This migration initializes the UI content'
