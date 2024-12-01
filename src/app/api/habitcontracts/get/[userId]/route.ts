import { collection, getDocs, DocumentData, query, where } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/config/firebase';
import { getUserById } from '../../../users/[userId]/route';
import { User, HabitContract } from '@/types';


export async function GET(
  req: NextRequest, 
  { params }: { params: { userId: string } }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const userData = await getUserById(userId) as User;
    const habitContracts: (HabitContract & { id: string })[] = [];


    if (userData.habitContracts && userData.habitContracts.length > 0) {
      const habitContractsRef = collection(db, 'habitContracts');
      const habitContractsSnapshot = await getDocs(habitContractsRef);
      habitContractsSnapshot.forEach((doc) => {
        const habitContractData = doc.data();
        if (userData.habitContracts.includes(habitContractData.contractId)) {
          habitContracts.push({ id: doc.id, ...habitContractData as HabitContract });
        }
      });
    }


    return NextResponse.json(habitContracts);
  } catch (error) {
    console.error('Error fetching habit contracts:', error);
    return NextResponse.json({ error: 'Failed to fetch habit contracts' }, { status: 500 });
  }
}