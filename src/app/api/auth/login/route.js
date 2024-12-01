import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const userData = await request.json();
    
    // Check if user exists in Firestore
    const userDoc = doc(db, 'users', userData.uid);
    const userDocSnapshot = await getDoc(userDoc);

    if (!userDocSnapshot.exists()) {
      // Save new user to Firestore
      await setDoc(userDoc, {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        createdAt: new Date().toISOString(),
        currentHabits: [],
        completedHabits: [],
        stakedBalance: 0.00
      });
    }

    // Set a session cookie
    const cookieStore = await cookies();
    cookieStore.set('firebase-token', userData.uid, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}