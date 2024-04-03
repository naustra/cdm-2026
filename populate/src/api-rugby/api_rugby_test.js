/*
 * Get score from API Rugby
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

const getLeagues = async () => {
  const options = {
    method: 'GET',
    url: 'https://api-rugby.p.rapidapi.com/leagues',
    headers,
  }
  const response = await axios.request(options)
  return response.data
}

const getGames = async () => {
  const options = {
    method: 'GET',
    url: 'https://api-rugby.p.rapidapi.com/games',
    params: {
      league: '69',
      season: '2023',
    },
    headers,
  }
  const response = await axios.request(options)
  // save in json file
  const fs = require('fs')
  fs.writeFileSync(
    'games.json',
    JSON.stringify(
      response.data.response.map((game) => ({
        id: game.id,
        date: game.date,
      })),
    ),
  )

  console.table(response.data.response)
  return response.data.response
}

const getGame = async (id) => {
  const options = {
    method: 'GET',
    url: 'https://api-rugby.p.rapidapi.com/games/',
    params: {
      id: id,
    },
    headers,
  }
  const response = await axios.request(options)
  return response.data.response[0]
}

const updateScores = async () => {
  const now = new Date()
  const inTwoHours = new Date()
  inTwoHours.setHours(inTwoHours.getHours() + 2)

  const matchesToNotify = await db
    .collection('matches')
    .where('dateTime', '>=', now)
    .where('dateTime', '<', inTwoHours)
    .get()

  await Promise.all(
    matchesToNotify.docs.map(async (matchSnap) => {
      const match = matchSnap.data()
      if (match.finished) return

      const gameStatus = await getGame(match.idApiRugby)
      console.log(
        '🚀 ~ file: api_rugby_test.js:86 ~ matchesToNotify.docs.map ~ gameStatus:',
        gameStatus,
      )

      // Update game Score and status
      await db
        .collection('matches')
        .doc(matchSnap.id)
        .update({
          scores: {
            A: gameStatus.scores.home,
            B: gameStatus.scores.away,
          },
          finished: gameStatus.status.long === 'Finished',
        })
    }),
  )
}

updateScores().then(() => process.exit(0))
