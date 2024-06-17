import { getDb } from '../migrations_utils/mongo-client';

export async function up(): Promise<void> {
  const db = await getDb();
}

export async function down(): Promise<void> {
  const db = await getDb();
}

export const description = 'This migration...';
