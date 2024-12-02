// src/app/api/verify/github/[username]/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '@/config/firebase';

// Type for GitHub event
interface GitHubEvent {
  type: string;
  created_at: string;
}

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_API_KEY = process.env.GITHUB_API_KEY;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const username  = (await params).userId
  const { habitContractId } = await req.json();
  const today = format(new Date(), 'yyyy-MM-dd');

  try {
    const response = await fetch(`${GITHUB_API_URL}/users/${username}/events/public`, {
      headers: {
        'Authorization': `token ${GITHUB_API_KEY}`
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch github events' }, { status: 500 });
    }

    const events: GitHubEvent[] = await response.json();
    const doneToday = events.some(event => {
      if (event.type === 'PushEvent') {
        return event.created_at.startsWith(today);
      }
      return false;
    });
    let habitCompleted = false;
    const contractRef = doc(db, 'habitContracts', habitContractId);
    const contractSnap = await getDoc(contractRef);
    if (contractSnap.exists()){
      const contract = contractSnap.data();
      // If checkin for today is done, don't check again, just return true for done today!
      if(contract.dailyCheckin){
        return NextResponse.json({ doneToday : true, habitCompleted });
      }
    }
    if (doneToday) {
      console.log("Contract data is", contractSnap.data())
      if (contractSnap.exists()) {
        const contract = contractSnap.data();
        const updatedStreak = contract.progress.streak + 1;
        const updatedDays = {
          ...contract.progress.days,
          [today]: { verified: true }
        };

        if (contract.duration === updatedStreak) {
          await updateDoc(contractRef, {
            'progress.streak': updatedStreak,
            'progress.days': updatedDays,
            dailyCheckin: true,
            lastVerifiedDate: today,
            status: 'Completed'
          });
          habitCompleted = true;

          // Reduce the user's stakedAmount by contract.stakeAmount
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
        else {
          await updateDoc(contractRef, {
            'progress.streak': updatedStreak,
            'progress.days': updatedDays,
            dailyCheckin: true,
            lastVerifiedDate: today
          });
        }
      }
    }

    return NextResponse.json({ doneToday, habitCompleted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to verify commit' }, { status: 500 });
  }
}

// Logic to call this API route from the frontend 


// const verifyGithubCommit = async () => {
//     try {
//       const response = await fetch('/api/verify/github/yajassardana');
//       const data = await response.json();
//       console.log(data);
//     } catch (error) {
//       console.error('Failed to verify GitHub commit:', error);
//     }
//   }