// src/app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  const cookieStore = cookies();
  (await cookieStore).delete('firebase-token');
  return NextResponse.json({ success: true });
}