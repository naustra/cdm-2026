/**
 * Script to test notifications in app.
 */
const { serviceAccount } = require('../chooseDatabase.js')

const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://rugby-2023-prod-4fa68-default-rtdb.europe-west1.firebasedatabase.app',
})

/**
 * Gather all currently active notification subscriptions
 *
 * @returns {FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]} Array of firebase snapshots
 */
async function getNotificationSubscription() {
  const snapshots = await admin
    .firestore()
    .collection('notificationSubscriptions')
    .get()

  return snapshots.docs
}

const data = {
  title: 'Début de la coupe du monde Vendredi à 21h !',
  body: 'Heureux de vous compter parmi nous ! Choisissez votre vainqueur final avant le début de la compétition ! ;)',
  url: '/',
}

const invalidTokenErrorCodes = [
  'messaging/registration-token-not-registered',
  'messaging/invalid-argument',
]

/**
 * Send messages to all valid subscriptors
 *
 * @param {FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]} notificationSubscriptionsSnapshots Array of firebase snapshots
 */
async function sendMessages(notificationSubscriptionsSnapshots) {
  const tokens = notificationSubscriptionsSnapshots.map((snap) =>
    snap.get('token'),
  )

  const response = await admin.messaging().sendMulticast({
    data,
    tokens,
  })

  console.log(`${response.successCount} notifications sent`)

  await removeInvalidTokens(response, notificationSubscriptionsSnapshots)
}

/**
 * Cleanup database by removing invalid tokens
 * @param {admin.messaging.BatchResponse} response Response of batched sent notification
 * @param {FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]} notificationSubscriptionsSnapshots Array of firebase snapshots
 */
async function removeInvalidTokens(
  response,
  notificationSubscriptionsSnapshots,
) {
  if (response.failureCount > 0) {
    const invalidSubscriptions = response.responses
      .map(({ success, error }, index) => {
        if (!success && invalidTokenErrorCodes.includes(error.code)) {
          return index
        }
        return null
      })
      .filter((index) => index !== null)
      .map((index) => notificationSubscriptionsSnapshots[index])
      .map((snap) => snap.ref)

    if (invalidSubscriptions.length) {
      const batch = admin.firestore().batch()

      invalidSubscriptions.forEach((ref) => batch.delete(ref))

      await batch.commit()

      console.log(`${invalidSubscriptions.length} subscriptions deleted`)
    }
  }
}

getNotificationSubscription()
  .then(sendMessages)
  .then(() => process.exit(0))
