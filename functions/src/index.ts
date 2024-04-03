import * as admin from 'firebase-admin'
admin.initializeApp()

import { updateScore } from './updateScore'
import { updateResult } from './updateResult'
import { updateOdds } from './updateOdds'
import * as users from './users'
import * as groups from './groups'
import * as notifications from './notifications'
// import * as chore from './chore'

export { updateScore, updateResult, updateOdds, users, groups, notifications }
