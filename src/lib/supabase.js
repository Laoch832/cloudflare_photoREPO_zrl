import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dsqvrjgrwkwaqdybxqgy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcXZyamdyd2t3YXFkeWJ4cWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwODk5NTYsImV4cCI6MjA4MzY2NTk1Nn0.bjWmKkloP7G9PYm2gwpGw_553oV-hOzmTWNpPgoPuh8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
