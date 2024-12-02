import type { NFT } from './nfts';

export type HabitStatus = 'Active' | 'Failed' | 'Completed';

interface DayProgress {
  verified: boolean;
  usedPasses?: number;
}

interface HabitContract {
  userId: string;
  habitId: number;
  habitVerifier: string;
  username: string;
  startDate: string;
  endDate: string;
  title: string;
  subtitle: string;
  stakedAmount: number;
  progress: {
    streak: number;
    days: {
      [key: string]: DayProgress;
    };
  };
  totalStakers: number;
  duration: number;
  status: HabitStatus;
  dailyCheckin: boolean;
  freePassesAllowed: number;
  usedPasses: number;
  createdAt: string;
  lastVerifiedDate: string;
  nft: NFT;
}

export type { HabitContract };