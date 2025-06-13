// app/api/lemonsqueezy/webhook/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // [수정] 함수 안에서 관리자 권한의 클라이언트를 생성합니다.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  if (!secret) {
    return new NextResponse('Webhook secret not configured.', { status: 500 });
  }

  // ... (시그니처 검증 로직은 동일) ...
  const text = await request.text();
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
  const signature = Buffer.from(request.headers.get('X-Signature') || '', 'utf8');

  if (!crypto.timingSafeEqual(digest, signature)) {
    return new NextResponse('Invalid signature.', { status: 400 });
  }

  try {
    const payload = JSON.parse(text);
    if (payload.meta.event_name === 'order_created') {
      const orderData = payload.data.attributes;
      const customData = orderData.custom_data || {};
      
      const nickname = customData.nickname;
      const message = customData.message || '';
      const amountInCents = orderData.total;

      if (!nickname || typeof amountInCents !== 'number') {
        throw new Error('Invalid payload data.');
      }
      
      // [수정] 관리자 클라이언트를 사용하여 DB 함수를 호출합니다.
      const { error } = await supabaseAdmin.rpc('handle_ping', {
        p_nickname: nickname,
        p_message: message,
        p_amount: amountInCents,
      });

      if (error) { throw error; }
    }
    
    return new NextResponse('Webhook processed successfully.', { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('Webhook Error:', message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 500 });
  }
}