import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from 'reactfire'
import { collection, orderBy, query } from '@firebase/firestore'
import { doc } from 'firebase/firestore'

export const useMatches = () => {
  const firestore = useFirestore()
  const matches = collection(firestore, 'matches')
  const matchesQuery = query(matches, orderBy('dateTime', 'asc'))

  return useFirestoreCollectionData(matchesQuery, { idField: 'id' }).data
}

export const useMatch = (matchId) => {
  const firestore = useFirestore()
  const matchRef = doc(firestore, 'matches', matchId)

  return useFirestoreDocData(matchRef, { idField: 'id' }).data
}
