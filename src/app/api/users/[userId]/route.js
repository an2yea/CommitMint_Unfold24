import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';

export async function getUserById(userId) {
  if (!userId) {
    throw new Error('Missing userId');
  }

  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error('User not found');
  }
  return userDoc.data();
}

export async function GET(req, { params }) {
  const { userId } = await params;

  try {
    const userData = await getUserById(userId);
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: error.message });
  }
}