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
    // [수정] message 컬럼도 함께 가져옵니다.
    const { data, error } = await supabase
      .from('messages')
      .select('total_amount, message') // 'message' 추가
      .eq('nickname', nickname)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data) {
      // [수정] 결과에 message를 포함하여 반환합니다.
      return NextResponse.json({ exists: true, totalAmount: data.total_amount, message: data.message });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('Check-nickname Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}