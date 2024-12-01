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
import { browseHabits } from '@/lib/habitdata';
import type { HabitType } from '@/types';
import userData from '@/lib/userData';

export default function DashboardPage(): JSX.Element {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("your-habits");
  const [selectedHabit, setSelectedHabit] = useState<HabitType | null>(null);
  const [isCreatingHabit, setIsCreatingHabit] = useState<boolean>(false);

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

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  const totalStaked = userData.habitContracts.reduce((sum, habit) => sum + habit.stakedAmount, 0)
  const totalParticipants = userData.habitContracts.reduce((sum, habit) => sum + habit.totalStakers, 0)

  if (!user) {
    return <></>;
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

        <YourHabits  user = {user} activeTab = {activeTab} setActiveTab={setActiveTab}/>
        <BrowseHabits habits={browseHabits} selectedHabit={selectedHabit} setSelectedHabit={setSelectedHabit} isCreatingHabit={isCreatingHabit} setIsCreatingHabit={setIsCreatingHabit} onHabitCreationComplete={onHabitCreationComplete} />
      </Tabs>
      <HabitCreationFlow
      isOpen={selectedHabit !== null}
      onClose={() => setSelectedHabit(null)}
      selectedHabit={selectedHabit}
      onHabitCreationComplete={onHabitCreationComplete}
      user={user}
      />
    </div>
  )
}


