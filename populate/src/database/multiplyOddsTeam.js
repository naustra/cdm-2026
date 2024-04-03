const { serviceAccount } = require('../chooseDatabase.js')

const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const factorMultiplicator = process.argv[2]

if (!factorMultiplicator) {
  console.log(`Usage: node ./${__filename} number`)
  process.exit(1)
}

// Iterate through all teams
const multiplyOddsTeams = async () => {
  // get teams
  const teams = await admin.firestore().collection('teams').get()

  // multiply winOddUnibet by factorMultiplicator and update winOdd
  for (const team of teams.docs) {
    const winOddUnibet = team.data().winOddUnibet
    const originalWinOdd = team.data().winOdd

    if (winOddUnibet) {
      const winOddUpdated = Math.round(winOddUnibet * factorMultiplicator)

      await admin

        .firestore()
        .collection('teams')
        .doc(team.id)
        .update({ winOdd: winOddUpdated })

      console.log(
        `WinOdd for team ${team.id} was at ${JSON.stringify(
          originalWinOdd,
        )} and has been updated from ${JSON.stringify(
          winOddUnibet,
        )} to ${JSON.stringify(winOddUpdated)}`,
      )
    }
  }
}

multiplyOddsTeams()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .then(() => process.exit(0))
