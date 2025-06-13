// app/api/lemonsqueezy/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  if (!secret) {
    return new NextResponse('Webhook secret not found in environment variables.', { status: 500 });
  }

  const text = await request.text();
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
  const signature = Buffer.from(request.headers.get('X-Signature') || '', 'utf8');

  if (!crypto.timingSafeEqual(digest, signature)) {
    return new NextResponse('Invalid signature.', { status: 400 });
  }

  try {
    const payload = JSON.parse(text);
    const eventName = payload.meta.event_name;

    if (eventName === 'order_created') {
      const orderData = payload.data.attributes;
      const customData = orderData.custom_data || {};
      
      const nickname = customData.nickname;
      const message = customData.message;
      const amount = orderData.total / 100;

      if (!nickname) {
        throw new Error('Nickname not found in custom data.');
      }

      const { error } = await supabase.rpc('handle_ping', {
        p_nickname: nickname,
        p_message: message,
        p_amount: amount,
      });

      if (error) {
        throw new Error(`Supabase RPC error: ${error.message}`);
      }
    }
    
    return new NextResponse('Webhook processed successfully.', { status: 200 });

  } catch (error: unknown) { // [수정] any 대신 unknown 타입을 사용합니다.
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error('Webhook Error:', message);
    return new NextResponse(`Webhook Error: ${message}`, { status: 500 });
  }
}