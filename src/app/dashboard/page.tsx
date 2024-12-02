// src/app/dashboard/route.js
'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import YourHabits from '../../components/YourHabits';
import BrowseHabits from '../../components/BrowseHabits';
import DashboardHeader from '../../components/DashboardHeader';
import TotalStaked from '../../components/TotalStaked';
import { X } from 'lucide-react'
import { HabitCreationFlow } from '@/components/HabitCreation';
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast";
import { useDashboardContext } from '@/context/DashboardContext';

function DashboardContent() {
  const { shouldFetchHabits, user, activeTab, error, setActiveTab, setUser, setError } = useDashboardContext();
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const router = useRouter();

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (error) {
    const timer = setTimeout(() => {
        setError(null)
      }, 5000)
    return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    const fetchUser = async () => {
      if (!firebaseUser?.uid) return;
      setError(null);
      try {
        const response = await fetch(`/api/users/${firebaseUser.uid}`);
  
        if (!response.ok) {
          setError('Failed to fetch user');
        }
  
        const data = await response.json();
        console.log("User is", data)
        setUser(data);         
      } catch (err : any) {
        setError(err?.message);
      }
    };
    fetchUser();
  }, [firebaseUser?.uid, shouldFetchHabits]);


  const handleCloseError = () => {
    setError(null)
  }


  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  if (!user) {
    return <></>;
  }

  return (
    <ToastProvider>
    <div className="min-h-screen bg-background text-foreground p-8">

      <DashboardHeader />

      <TotalStaked />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="your-habits">Your Habits</TabsTrigger>
          <TabsTrigger value="browse-habits">Browse Habits</TabsTrigger>
        </TabsList>

        <YourHabits />
        <BrowseHabits  />
      </Tabs>
      <HabitCreationFlow />
      <AnimatePresence>
      {error && (
            <Toast variant="destructive">
              <div className="flex justify-between items-start">
                <div>
                  <ToastTitle>Error</ToastTitle>
                  <ToastDescription>{error}</ToastDescription>
                </div>
                <ToastClose asChild>
                  <button
                    onClick={handleCloseError}
                    className="rounded-full p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </button>
                </ToastClose>
              </div>
            </Toast>
          )}
      </AnimatePresence>
      <ToastViewport />
    </div>
    </ToastProvider>
  )
}


export default function DashboardPage(): JSX.Element {
  return (
      <DashboardContent />
  );
}