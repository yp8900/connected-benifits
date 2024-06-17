import { find, keys } from 'lodash'
import { Db } from 'mongodb'

export async function collectionExists(
  db: Db,
  collectionName: string,
): Promise<boolean> {
  const collections = await db
    .listCollections({ name: collectionName })
    .toArray()

  return !!find(collections, (c) => c.name === collectionName)
}

export async function createCollectionIfNotExists(
  db: Db,
  collectionName: string,
): Promise<void> {
  if (!(await collectionExists(db, collectionName))) {
    await db.createCollection(collectionName)
  }
}

export async function dropCollectionIfExists(
  db: Db,
  collectionName: string,
): Promise<void> {
  if (await collectionExists(db, collectionName)) {
    await db.dropCollection(collectionName)
  }
}

export function indexExists(
  db: Db,
  collectionName: string,
  indexName: string,
): boolean {
  const indexes: any = db.collection(collectionName).indexes

  return !!indexes[indexName]
}

function getIndexNameFromFields(fields: Record<string, number>): string {
  return keys(fields).reduce((acc, key) => {
    return `${acc}${acc ? '_' : ''}${key}_${fields[key]}`
  }, '')
}

export async function dropIndexIfExists(
  db: Db,
  collectionName: string,
  fields: Record<string, number>,
): Promise<void> {
  const indexName = getIndexNameFromFields(fields)
  if (indexExists(db, collectionName, indexName)) {
    await db.collection(collectionName).dropIndex(indexName)
  }
}

export async function createIndexIfNotExists(
  db: Db,
  collectionName: string,
  fields: Record<string, number>,
  unique = false,
): Promise<void> {
  if (!indexExists(db, collectionName, getIndexNameFromFields(fields))) {
    db.collection(collectionName).createIndex(fields, { unique })
  }
}
