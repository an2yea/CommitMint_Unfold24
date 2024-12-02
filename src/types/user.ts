import type { NFT } from './nfts';

export interface User {
  email: string;
  username: string;
  created_at: string;
  habitContracts: string[];
  stakedAmount: number;
  avatar: string;
  uid: string;
  walletAddress: string | null;
  tokenBalance: number;
  nfts: NFT[];
} 