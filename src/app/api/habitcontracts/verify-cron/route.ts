import { db } from '@/config/firebase';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { collection, getDocs, query, where, doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { HabitContract } from '@/types'; // Adjust the import based on your project structure
import { format } from 'date-fns';

export async function POST (req: NextRequest){
  try{
    const habitContractsRef = collection(db, 'habitContracts');
    const activeContractsQuery = query(habitContractsRef, where('status', '==', 'Active'));
    const activeContractsSnapshot = await getDocs(activeContractsQuery);

    const today = format(new Date(), 'yyyy-MM-dd');

    for (const contractDoc of activeContractsSnapshot.docs) {
      const contract = contractDoc.data() as HabitContract;
      const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify/${contract.habitVerifier}/${contract.username}`;
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ habitContractId: contractDoc.id }),
      });

      const verificationResult = await response.json();

      if (!verificationResult.doneToday) {
        // Freepasses exhausted
        if (contract.freePassesAllowed - contract.usedPasses <= 0) {
          await updateDoc(contractDoc.ref, { status: 'Failed' });
  
          const userRef = doc(db, 'users', contract.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const user = userSnap.data();
            await updateDoc(userRef, {
              stakedAmount: user.stakedAmount - contract.stakedAmount
            });
          }
        }
        // Usefreepass 
        else {
          const updatedStreak = contract.progress.streak + 1;
          const updatedUsedPasses = contract.usedPasses + 1;
          const updatedDays = {
            ...contract.progress.days,
            [today]: { verified: true }
          };

          const isHabitCompleted = contract.duration === updatedStreak;
          await updateDoc(contractDoc.ref, {
            'progress.streak': updatedStreak,
            'progress.days': updatedDays,
            usedPasses: updatedUsedPasses,
            dailyCheckin: true,
            lastVerifiedDate: today,
            status: isHabitCompleted ? 'Completed' : 'Active'
          });

          if(isHabitCompleted){
            const userRef = doc(db, 'users', contract.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const user = userSnap.data();
              await updateDoc(userRef, {
                stakedAmount: user.stakedAmount - contract.stakedAmount,
                nfts: (user.nfts || []).concat(contract.nft),
                tokenBalance: user.tokenBalance + contract.stakedAmount
              });
            }
          }
        }
      }
    }
    return NextResponse.json({ message: 'Contracts verified successfully using cron' });
  }
  catch(error){
    console.error('Error verifying contracts in cron:', error);
    return NextResponse.json({ error: 'Failed to run verify cron' }, { status: 500 });
  }
};

// const handleCron = async () => {
//   const response = await fetch(`/api/habitcontracts/verify-cron`, {method: 'POST'});
//   const data = await response.json();
//   console.log(data);
// }