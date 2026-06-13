import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://dofzycogyzhzhdousob.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZnp5Y29neXpoemhoZG91c29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDkyNjMsImV4cCI6MjA5Mjk4NTI2M30.iv-phWRW9Jpz1hISR6iYvK80z6pdsGdIvECd7ForSys'
export const supabase = createClient(supabaseUrl, supabaseKey)
