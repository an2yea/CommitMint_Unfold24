import { LucideIcon } from 'lucide-react';

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
}


export type { HabitType };