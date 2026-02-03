import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://shbohgrpodzvganxlclx.supabase.co'
const supabaseAnonKey = 'sb_publishable_iK4U60rRd0PnCg0UHlYvKA_1d9j2W6x' // Substitua pela sua chave Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)