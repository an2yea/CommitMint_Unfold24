import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';

export async function getUserById(userId: string): Promise<DocumentData> {
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return userDoc.data();
}

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  try {
    const userData = await getUserById(userId);
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}