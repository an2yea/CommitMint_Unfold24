import type { HabitContract } from './habit_contract';

export interface User {
  email: string;
  username: string;
  created_at: string;
  habitContracts: HabitContract[];
  staked_amount: number;
  avatar: string;
  uid: string;
} 