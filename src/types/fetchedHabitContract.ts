export type HabitStatus = 'Active' | 'Failed' | 'Completed';

interface DayProgress {
  verified: boolean;
  usedPasses?: number;
}

interface FetchedHabitContract {
  userId: string;
  id: string;
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
}

export type { FetchedHabitContract };