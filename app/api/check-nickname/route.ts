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
      .single(); // .single()은 결과가 하나이거나 없어야 함을 의미

    if (error && error.code !== 'PGRST116') {
      // PGRST116은 결과가 없다는 에러코드이므로, 이건 정상적인 상황입니다.
      throw error;
    }

    if (data) {
      // 닉네임이 존재할 경우
      return NextResponse.json({ exists: true, totalAmount: data.total_amount });
    } else {
      // 닉네임이 존재하지 않을 경우
      return NextResponse.json({ exists: false });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}