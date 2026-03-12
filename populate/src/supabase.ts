import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import type { Database } from '../../src/lib/database.types'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)
