// src/app/dashboard/route.js
'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import YourHabits from '../../components/YourHabits';
import BrowseHabits from '../../components/BrowseHabits';
import DashboardHeader from '../../components/DashboardHeader';
import TotalStaked from '../../components/TotalStaked';
import { HabitCreationFlow } from '@/components/HabitCreation';
import { browseHabits } from '@/lib/data';

const userData = {
  name: "Jane Doe",
  avatar: "https://github.com/shadcn.png",
  habits: [
    { id: 1, name: "Daily Exercise", streak: 7, goalDays: 30, staked: 50, freePasses: 2, participants: 1500 },
    { id: 2, name: "Meditation", streak: 15, goalDays: 21, staked: 100, freePasses: 1, participants: 2000 },
    { id: 3, name: "Reading", streak: 5, goalDays: 14, staked: 30, freePasses: 3, participants: 1000 },
    { id: 4, name: "Healthy Eating", streak: 10, goalDays: 30, staked: 75, freePasses: 0, participants: 1800 },
  ]
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const onHabitCreationComplete = () => {
    setSelectedHabit(null);
    setActiveTab("your-habits");
    setIsCreatingHabit(false);
  };

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("your-habits")
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [isCreatingHabit, setIsCreatingHabit] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const totalStaked = userData.habits.reduce((sum, habit) => sum + habit.staked, 0)
  const totalParticipants = userData.habits.reduce((sum, habit) => sum + habit.participants, 0)



  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">

      <DashboardHeader user={user} handleSignOut={handleSignOut} userData={userData} />

      <TotalStaked totalStaked={totalStaked} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="your-habits">Your Habits</TabsTrigger>
          <TabsTrigger value="browse-habits">Browse Habits</TabsTrigger>
        </TabsList>

        <YourHabits habits={userData.habits} />
        <BrowseHabits habits={browseHabits} selectedHabit={selectedHabit} setSelectedHabit={setSelectedHabit} isCreatingHabit={isCreatingHabit} setIsCreatingHabit={setIsCreatingHabit} onHabitCreationComplete={onHabitCreationComplete} />
      </Tabs>
      <HabitCreationFlow
      isOpen={selectedHabit !== null}
      onClose={() => setSelectedHabit(null)}
      selectedHabit={selectedHabit}
      onHabitCreationComplete={onHabitCreationComplete}
      />
    </div>
  )
}


