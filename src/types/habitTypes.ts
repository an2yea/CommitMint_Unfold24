import { LucideIcon } from 'lucide-react';
import type { NFT } from './nfts';

interface VerificationDetails{
    apiUrl: string
    params: string[]
    frequency: string
}

interface HabitType {
    id: number
    icon: LucideIcon
    title: string
    subtitle: string
    totalStakers: number
    verificationType: string
    verificationDetails: VerificationDetails
    habitVerifier: string
    nft: NFT
}


export type { HabitType };