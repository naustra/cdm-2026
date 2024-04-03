import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@firebase/firestore'
import {
  assertFails,
  assertSucceeds,
  RulesTestContext,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  createTestEnvironment,
  ruleTestingCleanup,
  TEST_UID,
} from './testUtils'

const GROUP_ID = 'GROUP_ID'

describe('Firebase rules/groups', () => {
  let env: RulesTestEnvironment

  beforeAll(async () => {
    env = await createTestEnvironment()

    await env.withSecurityRulesDisabled(async (context: RulesTestContext) => {})
  })

  afterAll(() => ruleTestingCleanup(env))

  afterEach(async () => {
    await env.withSecurityRulesDisabled(async (context: RulesTestContext) => {
      const groupsCollection = collection(context.firestore(), 'groups')
      await deleteDoc(doc(groupsCollection, GROUP_ID))
    })
  })

  describe('with authenticated context', () => {
    let groupsCollection: CollectionReference<DocumentData>

    beforeAll(() => {
      groupsCollection = collection(
        env.authenticatedContext(TEST_UID).firestore(),
        'groups',
      )
    })

    it('should allow group creation if data is valid', async () => {
      await assertSucceeds(createGroup(groupsCollection))
    })

    describe('with user admin context', () => {
      let groupsCollection: CollectionReference<DocumentData>

      beforeAll(() => {
        groupsCollection = collection(
          env.authenticatedContext(TEST_UID, { role: 'admin' }).firestore(),
          'groups',
        )
      })

      it('should be also be refused if user is admin', async () => {
        await createGroup(groupsCollection)
        await assertFails(
          updateDoc(doc(groupsCollection, GROUP_ID), {
            createdAt: new Date('2018-05-10'),
          }),
        )
      })
    })
  })

  function createGroup(
    groupsCollection: CollectionReference<DocumentData>,
    {
      name = 'groupe test',
      createdBy = TEST_UID,
      createdAt = serverTimestamp(),
      joinKey = 'ABCDE',
      version = 1,
    }: any = {},
  ) {
    return setDoc(doc(groupsCollection, GROUP_ID), {
      name,
      createdBy,
      createdAt,
      joinKey,
      version,
    })
  }
})
