/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MongoClient = require('mongodb').MongoClient
const collectionName = 'cb_db_migrations'

class MongoDbStore {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async load(fn) {
    let client = null
    let data = null
    try {
      client = await MongoClient.connect(process.env.MONGODB_URL, {
        useUnifiedTopology: true,
      })
      const db = client.db()
      data = await db.collection(collectionName).find().toArray()
      if (!data.length) {
        console.log(
          'Cannot read migrations from database. If this is the first\
           time you ran migrations, then this is normal.',
        )
        return fn(null, {})
      }
    } finally {
      if (client) client.close()
    }

    return fn(null, {
      migrations: data,
    })
  }

  async save(set, fn) {
    let client = null
    let result = null
    try {
      const {
        migrations
      } = set
      client = await MongoClient.connect(process.env.MONGODB_URL)
      const db = client.db()

      const updates = migrations.map((migration) => {
        return {
          updateOne: {
            filter: {
              title: migration.title,
            },
            update: {
              $set: migration,
            },
            upsert: true,
          },
        }
      })

      result = await db.collection(collectionName).bulkWrite(updates, {
        ordered: false,
      })
    } finally {
      if (client) client.close()
    }

    return fn(null, result)
  }
}

module.exports = MongoDbStore