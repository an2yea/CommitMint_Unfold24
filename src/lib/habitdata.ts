import {Laptop, Dumbbell, Salad, Camera, Brain} from 'lucide-react'
import type { HabitType } from '@/types';


export const browseHabits: HabitType[] = [
    {   
        id: 1, 
        habitVerifier: "github",
        icon: Laptop,
        title: "Level Up Your Coding Skills!",
        subtitle: "Commit to growth—make one GitHub contribution daily.",
        totalStakers: 15,
        verificationType: "api",
        verificationDetails: {
            apiUrl: "/api/verify/github/",
            params: ["username"],
            frequency: "daily"
        },
        nft: {
            id: "1",
            name: "Developer NFT",
            description: "A NFT for the best developers",
            image: "/images/developer.png"
        }
     },
     {   
        id: 2, 
        icon: Dumbbell,
        habitVerifier: "strava",
        title: "Get Stronger Every Day!",
        subtitle: "One physical activity to keep you fitter, stronger, and energized.",
        totalStakers: 20,
        verificationType: "api",
        verificationDetails: {
            apiUrl: "/api/verify/strava/",
            params: ["username"],
            frequency: "daily"
        },
        nft: {
            id: "2",
            name: "Fitness NFT",
            description: "A NFT for fitness pros",
            image: "/images/fit.png"
        }
     },
     {   
        id: 3, 
        icon: Laptop,
        habitVerifier: "leetcode",
        title: "Sharpen Your Problem-Solving Skills!",
        subtitle: "Ace one LeetCode problem every single day.",
        totalStakers: 15,
        verificationType: "api",
        verificationDetails: {
            apiUrl: "/api/verify/leetcode/",
            params: ["username"],
            frequency: "daily"
        },
        nft: {
            id: "3",
            name: "Developer NFT",
            description: "A NFT for developers",
            image: "/images/random.png"
        }
     },
     {
        id: 4,
        icon: Camera,
        habitVerifier: "youtube",
        title: "Create and Inspire!",
        subtitle: "Release one YouTube video every week and grow your audience.",
        totalStakers: 23,
        verificationType: "api",
        verificationDetails: {
            apiUrl: "/api/verify/youtube/",
            params: ["username"],
            frequency: "weekly"
        },
        nft: {
            id: "4",
            name: "Content Creator NFT",
            description: "A NFT for content creators",
            image: "/images/random.png"
        }
     },
     {
        id:5,
        icon: Brain,
        habitVerifier: "Headspace",
        title: "Find Your Inner Calm!",
        subtitle: "Complete one Headspace session daily for a mindful reset.",
        totalStakers: 10,
        verificationType: "api",
        verificationDetails: {
            apiUrl: "/api/verify/headspace/",
            params: ["username"],
            frequency: "daily"
        },
        nft: {
            id: "5",
            name: "Mindfulness NFT",
            description: "A NFT for mindfulness enthusiasts",
            image: "/images/random.png"
        }
     }
  ]