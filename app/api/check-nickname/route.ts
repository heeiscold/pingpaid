// app/api/check-nickname/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // [수정] 함수가 호출될 때마다 클라이언트를 새로 생성합니다.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { searchParams } = new URL(request.url);
  const nickname = searchParams.get('name');

  if (!nickname) {
    return NextResponse.json({ error: 'Nickname is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('message, total_amount')
      .eq('nickname', nickname)
      .single();

    if (error && error.code !== 'PGRST116') { throw error; }

    if (data) {
      return NextResponse.json({ exists: true, message: data.message, totalAmount: data.total_amount });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}