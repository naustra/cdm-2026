/*
 * Get odds from API Rugby
 */
const axios = require('axios')
require('dotenv').config({ path: '../.env' })
const { serviceAccount } = require('../chooseDatabase.js')

const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const headers = {
  'X-RapidAPI-Key': process.env.API_RUGBY_KEY,
  'X-RapidAPI-Host': 'api-rugby.p.rapidapi.com',
}

const getOddsGames = async () => {
  const options = {
    method: 'GET',
    url: 'https://api-rugby.p.rapidapi.com/odds',
    params: {
      league: '69',
      season: '2023',
      bookmaker: '6',
      bet: '1',
    },
    headers,
  }
  const response = await axios.request(options)
  return response.data.response
}

const updateScores = async () => {
  const oddsGames = await getOddsGames()

  await Promise.all(
    oddsGames.map(async (matchData) => {
      const matchSnap = await db
        .collection('matches')
        .where('idApiRugby', '==', matchData.game.id.toString())
        .get()

      if (matchSnap.size === 0) return

      const match = matchSnap.docs[0].data()

      if (match.finished) return

      const bets = matchData.bookmakers[0].bets[0].values
      if (!bets) return

      // Update game Score and status
      await db
        .collection('matches')
        .doc(matchSnap.docs[0].id)
        .update({
          oddsUnibet: {
            PA: bets[0].odd,
            PN: bets[1].odd,
            PB: bets[2].odd,
          },
          odds: {
            PA: Math.round(bets[0].odd * 110),
            PN: Math.round(bets[1].odd * 110),
            PB: Math.round(bets[2].odd * 110),
          },
          display: true,
        })
    }),
  )
}

updateScores().then(() => process.exit(0))
