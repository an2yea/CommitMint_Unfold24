import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { db } from '@/config/firebase';

export async function GET(req, { params }) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' });
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const habitContracts = [];

    if (userData.currentHabits && userData.currentHabits.length > 0) {
      const habitContractsRef = collection(db, 'habitContracts');
      const habitContractsSnapshot = await getDocs(habitContractsRef);
      habitContractsSnapshot.forEach((doc) => {
        const habitContractData = doc.data();
        if (userData.currentHabits.includes(habitContractData.contractId)) {
          habitContracts.push({ id: doc.id, ...habitContractData });
        }
      });
    }

    return NextResponse.json(habitContracts);
  } catch (error) {
    console.error('Error fetching habit contracts:', error);
    return NextResponse.json({ error: 'Failed to fetch habit contracts' });
  }
}