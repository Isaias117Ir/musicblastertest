
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://khklsmsdvqfpvyhfxxyx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoa2xzbXNkdnFmcHZ5aGZ4eHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NjQ3MjUsImV4cCI6MjA4MTA0MDcyNX0.eCIm_w1p2yiiaZIrhdWHfR2RIhp2OwBaCBPTahlrdKQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
