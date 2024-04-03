/*
 * Check if the sum of points won equals to the points people have in ranking
 */
const { serviceAccount } = require('../chooseDatabase.js')

const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

db.collection('opponents')
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const { uid, score, displayName } = doc.data()
      console.log(uid, score, displayName)

      return db
        .collection('bets')
        .where('uid', '==', uid)
        .get()
        .then((betSnap) => {
          let betScore = 0
          betSnap.forEach((betDoc) => {
            const { pointsWon } = betDoc.data()
            if (!isNaN(pointsWon)) betScore += Math.round(pointsWon) // eslint-disable-line no-restricted-globals
          })
          if (Math.abs(score - betScore) > 0.01) {
            console.log(`User: ${displayName} ${score} ${Math.round(betScore)}`)
            // return db
            //   .collection('opponents')
            //   .doc(uid)
            //   .update({
            //     score: Math.round(betScore),
            //   })
          }
        })
    })
  })
