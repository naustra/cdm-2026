import {
  collection,
  increment,
  serverTimestamp,
  doc,
  setDoc,
  where,
  query,
} from '@firebase/firestore'
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from 'reactfire'

export const useBetsFromGame = (matchId) => {
  const firestore = useFirestore()
  const matches = collection(firestore, 'bets')
  const matchesQuery = query(matches, where('matchId', '==', matchId))

  return useFirestoreCollectionData(matchesQuery, { idField: 'id' }).data
}

export const useBetFromUser = (matchId, uid) => {
  const firestore = useFirestore()
  const betsCollection = collection(firestore, 'bets')
  const documentRef = doc(betsCollection, `${matchId}_${uid}`)

  return [useFirestoreDocData(documentRef).data]
}

export const useBet = (matchId) => {
  const {
    data: { uid },
  } = useUser()

  const firestore = useFirestore()
  const betsCollection = collection(firestore, 'bets')
  const documentRef = doc(betsCollection, `${matchId}_${uid}`)

  const setBet = (bet) => {
    setDoc(
      documentRef,
      {
        ...bet,
        matchId,
        uid,
        updatedAt: serverTimestamp(),
        version: increment(1),
      },
      { merge: true },
    )
  }

  return [useFirestoreDocData(documentRef).data, setBet]
}
