import type { HabitContract } from './habitContract';

export interface User {
  email: string;
  username: string;
  created_at: string;
  habitContracts: string[];
  stakedAmount: number;
  avatar: string;
  uid: string;
  walletAddress: string | null;
} 