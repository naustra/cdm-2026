import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { EU_WEST_3 } from './constants'

const db = admin.firestore()

interface Odds {
  PA: number
  PN: number
  PB: number
  [key: string]: number
}

interface Scores {
  A: number
  B: number
}

interface Bet {
  betTeamA: number
  betTeamB: number
  uid: string
  pointsWon: number
}

const facteurMultiplicateurPhase: { [key: string]: number } = {
  0: 1,
  4: 2,
  2: 4,
  3: 6,
  1: 10,
}

const round = (value: number, decimals: number): number => {
  return Number(`${Math.round(value * 10 ** decimals)}${`e-${decimals}`}`)
}

export const updateScore = functions
  .region(EU_WEST_3)
  .runWith({ maxInstances: 3 })
  .firestore.document('matches/{matchId}')
  .onUpdate((change) => {
    // Get final scores
    // odds: {PA, PN, PB}
    // scores: {A, B}
    const { odds, scores, phase } = change.after.data() as {
      odds: Odds
      scores: Scores
      phase: string
    }
    if (
      scores === undefined ||
      scores.A === undefined ||
      scores.B === undefined
    ) {
      console.log('No scores defined (sorry not sorry)')
      return null
    }

    const realScoreTeamA = scores.A
    const realScoreTeamB = scores.B
    const realResult = findResult(realScoreTeamA, realScoreTeamB)

    // Get bets
    const bets = db.collection('bets')
    return bets
      .where('matchId', '==', change.after.ref.id)
      .get()
      .then((datas) => {
        const promises: Promise<any>[] = []

        datas.forEach((doc) => {
          // Get a bet
          const bet = doc.data() as Bet
          const { betTeamA, betTeamB, uid: userId } = bet
          const betId = doc.id
          const oldBetScore = bet.pointsWon

          const betResult = findResult(betTeamA, betTeamB)

          // For group match GoodResult = GoodWinner, bet is lost only based on result
          const hasGoodResult = betResult === realResult

          if (!phase || phase === '0') {
            console.log('Match de phase de poule')
          } else {
            console.log('Phase finale ', phase)
          }

          if (!hasGoodResult) {
            console.log(
              "YOU LOSE SON, you didn't find the score neither the match issue",
            )
            promises.push(updateUserScore(userId, oldBetScore))
            promises.push(updatePointsWon(betId))
          } else {
            // If the user found the result, he win points
            const oddBet = odds[`P${betResult}`]

            const nbButsEcart =
              Math.abs(realScoreTeamA - betTeamA) +
              Math.abs(realScoreTeamB - betTeamB)

            const facteurMultiplicateur = facteurMultiplicateurPhase[phase]

            const points = Math.round(
              (oddBet - nbButsEcart) * facteurMultiplicateur,
            )

            promises.push(updateUserScore(userId, oldBetScore, points))
            promises.push(updatePointsWon(betId, points))
          }
        })

        return Promise.all(promises)
      })
  })

const updateUserScore = (
  userId: string,
  oldBetScore = 0,
  points = 0,
): Promise<void> => {
  console.log(`Updating user score for ${userId}`)
  const user = db.collection('opponents').doc(userId)

  return db
    .runTransaction((t) =>
      t.get(user).then((snapshot) => {
        const oldScore = snapshot.data()?.score || 0

        const newScore = round(oldScore - oldBetScore + points, 2)
        console.log(
          `User score update ${userId} (${oldScore} - ${oldBetScore} + ${points} = ${newScore})`,
        )
        return t.update(user, { score: newScore })
      }),
    )
    .then(() => console.log(`User score updated for ${userId}`))
    .catch((err) => console.error(`User ${userId} score update failure:`, err))
}

const updatePointsWon = (id: string, points = 0): Promise<void> => {
  console.log(`Updating points won for bet ${id}`)
  const bets = db.collection('bets').doc(id)

  return db
    .runTransaction((t) =>
      t.get(bets).then((betSnap) =>
        t.update(betSnap.ref, {
          pointsWon: points,
        }),
      ),
    )
    .then(() => console.log(`Bet ${id} update with ${points} points`))
    .catch((err) => {
      console.error(`Bet ${id} update failure:`, err)
    })
}

const findResult = (score1: number, score2: number): string => {
  if (score1 > score2) return 'A'
  if (score1 === score2) return 'N'
  return 'B'
}
