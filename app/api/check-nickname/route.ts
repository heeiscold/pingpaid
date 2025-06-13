// app/api/check-nickname/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nickname = searchParams.get('name');

  if (!nickname) {
    return NextResponse.json({ error: 'Nickname is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('total_amount')
      .eq('nickname', nickname)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116은 '결과 행이 없음'을 의미하는 정상적인 오류 코드입니다.
      throw error;
    }

    if (data) {
      return NextResponse.json({ exists: true, totalAmount: data.total_amount });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error: unknown) { // [수정] any 대신 unknown 타입을 사용합니다.
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('Check-nickname Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}