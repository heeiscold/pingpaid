// lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 이것은 브라우저(프론트엔드)에서 안전하게 사용할 수 있는 '공개용' 클라이언트입니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)