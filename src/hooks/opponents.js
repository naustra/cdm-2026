import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDoc,
} from 'reactfire'
import { useBatchedMultiGet } from './utils'
import { collection, query, doc } from 'firebase/firestore'

export const useOpponents = (userIds) => {
  return useBatchedMultiGet(userIds, 'opponents')
}

export const useAllOpponents = () => {
  const firestore = useFirestore()
  const opponentsCollection = collection(firestore, 'opponents')
  const opponentsQuery = query(opponentsCollection)

  return useFirestoreCollection(opponentsQuery).data?.docs
}

export const useOpponent = (userId) => {
  const firestore = useFirestore()
  const opponentDoc = doc(firestore, `opponents/${userId}`)

  return useFirestoreDoc(opponentDoc).data
}
