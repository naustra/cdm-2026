const fs = require('fs')
const { promisify } = require('util')
const { serviceAccount } = require('../chooseDatabase.js')

const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const displayBets = async () => {
  const querySnapshot = await db
    .collection('bets')
    .where('pointsWon', '!=', 0)
    .get()

  const data = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const { uid, matchId, betTeamA, betTeamB, pointsWon } = doc.data()

      const { teamA, teamB, scores } = (
        await db.collection('matches').doc(matchId).get()
      ).data()
      const { name: nameTeamA } = (
        await db.collection('teams').doc(teamA).get()
      ).data()
      const { name: nameTeamB } = (
        await db.collection('teams').doc(teamB).get()
      ).data()
      const { displayName: userName } = (
        await db.collection('opponents').doc(uid).get()
      ).data()

      const score = betTeamA + ' - ' + betTeamB
      const scoreReel = scores ? scores.A + ' - ' + scores.B : 'not played'

      return {
        userName,
        nameTeamA,
        score,
        nameTeamB,
        scoreReel,
        pointsWon,
        malus: Math.abs(betTeamA - scores.A) + Math.abs(betTeamB - scores.B),
      }
    }),
  )

  // Calculate mean of malus
  const meanMalus = data.reduce((acc, row) => acc + row.malus, 0) / data.length

  console.log('Mean malus:', meanMalus)

  const csv = data.reduce(
    (acc, row) =>
      acc +
      `${row.userName},${row.nameTeamA},${row.score},${row.nameTeamB},${row.scoreReel},${row.pointsWon},${row.malus}\n`,
    'User,Team A,Bet,Team B,Real Score,Points Won,Malus\n',
  )

  await promisify(fs.writeFile)('bets.csv', csv)
}

displayBets()
  .then(() => {
    console.log('CSV file created successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error creating CSV file:', error)
    process.exit(1)
  })
