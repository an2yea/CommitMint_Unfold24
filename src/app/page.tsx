// app/page.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage(): JSX.Element | null {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [router]);

  return null;
}