import { collection, addDoc, Timestamp, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { format } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { HabitContract } from '@/types';
import CreateHabitContractRequest from '@/types/createHabitRequest';

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const body = await req.json() as CreateHabitContractRequest;
  const { userId, habitId, habitVerifier, username, days, freePasses, stake, title, subtitle } = body;

  if (!userId || !habitId || !habitVerifier || !username || !days || !freePasses || !stake) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const startDate = format(new Date(), 'yyyy-MM-dd');
  const endDate = format(new Date(Date.now() + days * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  
  const habitContract: HabitContract = {
    userId,
    habitVerifier: habitVerifier,
    username,
    startDate,
    endDate,
    duration: days,
    freePassesAllowed: freePasses,
    usedPasses: 0,
    stakedAmount: Number(stake),
    progress: {
      streak: 0,
      days: {},
    },
    status: 'Active',
    createdAt: new Date().toISOString(),
    lastVerifiedDate: '',
    title,
    subtitle,
    habitId: parseInt(habitId),
    totalStakers: 0,
    dailyCheckin: false,
  };

  console.log('Creating habit contract:', habitContract);

  try {
    const habitContractRef = await addDoc(collection(db, 'habitContracts'), habitContract);
    const habitContractId = habitContractRef.id;

    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        habitContracts: arrayUnion(habitContractId),
        stakedAmount: Number(userDoc.data().stakedAmount) + habitContract.stakedAmount
      });
    } else {
      console.error('User not found:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Habit contract created successfully' });
  } catch (error) {
    console.error('Error creating habit contract:', error);
    return NextResponse.json({ error: 'Failed to create habit contract' }, { status: 500 });
  }
}