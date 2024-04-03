import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { EU_WEST_3 } from '../constants'
import { GroupApply } from '../model'

const db = admin.firestore()

export const applyInGroup = functions
  .region(EU_WEST_3)
  .runWith({ maxInstances: 3 })
  .firestore.document('groupApply/{applyId}')
  .onCreate(async (groupApplySnapshot) => {
    const { groupId, uid } = groupApplySnapshot.data() as GroupApply

    const groupRef = db.collection('groups').doc(groupId)
    const payingGroup = false

    const membersKey = payingGroup ? 'awaitingMembers' : 'members'

    const batch = db.batch()
    batch.update(groupRef, {
      [membersKey]: admin.firestore.FieldValue.arrayUnion(uid),
    })
    batch.update(groupApplySnapshot.ref, {
      status: payingGroup ? 'applied' : 'validated',
      appliedAt: admin.firestore.FieldValue.serverTimestamp(),
      validatedAt: payingGroup
        ? null
        : admin.firestore.FieldValue.serverTimestamp(),
    })

    return batch.commit()
  })
