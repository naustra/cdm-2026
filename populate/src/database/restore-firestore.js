const { serviceAccount, directoryDatabase } = require('../chooseDatabase.js')

const { restore, initializeFirebaseApp } = require('firestore-export-import')
const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
const db = admin.firestore()

initializeFirebaseApp(serviceAccount)

const options = {
  autoParseDates: true,
}

async function deleteCollection(collectionName, batchSize) {
  const collectionRef = db.collection(collectionName)
  const query = collectionRef.orderBy('__name__').limit(batchSize)

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject)
  })
}

async function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  const snapshot = await query.get()

  if (snapshot.size === 0) {
    // When there are no documents left, we are done
    return resolve()
  }

  const batch = db.batch()
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })

  await batch.commit()

  process.nextTick(() => {
    deleteQueryBatch(db, query, batchSize, resolve, reject)
  })
}

const importCollection = async (collectionName) => {
  console.log(`Deleting collection ${collectionName}...`)
  await deleteCollection(collectionName, 100) // 100 is the batch size. Adjust as necessary.

  restore(
    `./firestore-data/${directoryDatabase}/${collectionName}.json`,
    options,
  ).then(() => console.log(`Collection ${collectionName} was imported`))
}

importCollection('matches')
importCollection('teams')
