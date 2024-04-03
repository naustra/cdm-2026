import { collection, doc } from '@firebase/firestore'
import { useFirestore, useFirestoreDocData } from 'reactfire'

export const useCompetitionData = () => {
  const firestore = useFirestore()
  const competitionsRef = collection(firestore, 'competitions')
  const documentRef = doc(competitionsRef, 'GsayPL2SzeLl79O2l1Bc')

  return useFirestoreDocData(documentRef).data
}
