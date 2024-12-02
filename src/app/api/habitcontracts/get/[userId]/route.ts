import { collection, doc, getDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { User, HabitContract } from '@/types';


export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ userId: string }> }
) {
  const  userId  = (await params).userId;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const userUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${userId}`;
    const response = await fetch(userUrl, {
      method: 'GET',
    });
    const userData = await response.json() as User;
    const habitContracts: ({ id: string } & HabitContract)[] = [];


    if (userData.habitContracts && userData.habitContracts.length > 0) {
      const habitContractsRef = collection(db, 'habitContracts');
      for (const habitId of userData.habitContracts) {
        const habitDocRef = doc(habitContractsRef, habitId);
        const habitDocSnapshot = await getDoc(habitDocRef);
        if (habitDocSnapshot.exists()) {
          const habitContractData = habitDocSnapshot.data() as HabitContract;
          habitContracts.push({ id: habitDocSnapshot.id, ...habitContractData });
        }
      }
    }


    return NextResponse.json(habitContracts);
  } catch (error) {
    console.error('Error fetching habit contracts:', error);
    return NextResponse.json({ error: 'Failed to fetch habit contracts' }, { status: 500 });
  }
}