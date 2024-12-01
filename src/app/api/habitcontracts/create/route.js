import { collection, addDoc, Timestamp, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';

export async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' });
  }

  const { userId, habitId, habitVerifier, username, days, freePasses, stake, habitTitle, habitSubtitle } = await req.json();

  if (!userId || !habitId || !habitVerifier || !username || !days || !freePasses || !stake) {
    return NextResponse.json({ error: 'Missing requires fields' });
  }

  const contractId = uuidv4();
  const startDate = format(new Date(), 'yyyy-MM-dd');
  const endDate = format(new Date(Date.now() + days * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

  const habitContract = {
    contractId,
    userId,
    habitId,
    habitVerifier,
    username,
    startDate,
    endDate,
    duration: days,
    freePassesAllowed: freePasses,
    usedPasses: 0,
    stakedAmount: stake,
    progress: {
      streak: 0,
      days: {},
    },
    status: 'active',
    createdAt: Timestamp.now(),
    lastVerifiedDate: '',
    habitTitle,
    habitSubtitle
  };

  console.log('Creating habit contract:', habitContract);

  try {
    await addDoc(collection(db, 'habitContracts'), habitContract);

    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        currentHabits: arrayUnion(contractId)
      });
    } else {
      console.error('User not found:', userId);
      return NextResponse.json({ error: 'User not found' });
    }

    return NextResponse.json({ message: 'Habit contract created successfully' });
  } catch (error) {
    console.error('Error creating habit contract:', error);
    return NextResponse.json({ error: 'Failed to create habit contract' });
  }
}