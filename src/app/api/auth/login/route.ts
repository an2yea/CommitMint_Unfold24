import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '@/types';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}


export async function POST(request: Request): Promise<NextResponse> {
  try {
    const userData: UserData = await request.json();
    
    // Check if user exists in Firestore
    const userDoc = doc(db, 'users', userData.uid);
    const userDocSnapshot = await getDoc(userDoc);

    if (!userDocSnapshot.exists()) {
      // Save new user to Firestore
      const newUserData: User = {
        email: userData.email ?? '',
        username: userData.displayName ?? '',
        uid: userData.uid,
        created_at: new Date().toISOString(),
        habitContracts: [],
        stakedAmount: 0.00,
        avatar: userData.photoURL ?? ''
      };
      
      await setDoc(userDoc, newUserData);
    }

    // Set a session cookie
    (await cookies()).set('firebase-token', userData.uid, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 