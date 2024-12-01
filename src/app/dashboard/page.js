// src/app/dashboard/route.js
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Ticket, Users } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, Flame } from 'lucide-react'


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

  const [mounted, setMounted] = useState(false)

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.displayName}</h1>
          <Avatar>
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <Button
              onClick={handleSignOut}
              className=" bg-white text-black hover:bg-gray-100 transition-all duration-200"
            >
              Sign Out
            </Button>
        </header>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Total Staked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold flex items-center">
              <DollarSign className="mr-2" />
              {totalStaked.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Your Habits</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userData.habits.map((habit, index) => (
            <Dialog key={habit.id}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {habit.name}
                        <Badge variant="secondary" className="ml-2">
                          <Flame className="mr-1 h-4 w-4" />
                          {habit.streak}/{habit.goalDays} days
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold flex items-center mb-2">
                        <DollarSign className="mr-1 h-5 w-5" />
                        {habit.staked.toFixed(2)}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress</span>
                          <span>{Math.round((habit.streak / habit.goalDays) * 100)}%</span>
                        </div>
                        <Progress value={(habit.streak / habit.goalDays) * 100} className="w-full" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{habit.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Streak Progress</h4>
                    <Progress value={(habit.streak / habit.goalDays) * 100} className="w-full" />
                    <p className="text-sm text-muted-foreground">{habit.streak} days out of {habit.goalDays} day goal</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Current Streak</p>
                      <p className="text-sm text-muted-foreground">{habit.streak} days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Amount Staked</p>
                      <p className="text-sm text-muted-foreground">${habit.staked.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Ticket className="h-5 w-5 text-blue-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Free Passes Left</p>
                      <p className="text-sm text-muted-foreground">{habit.freePasses}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-purple-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Current Participants</p>
                      <p className="text-sm text-muted-foreground">{habit.participants.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </motion.div>
    </div>
  )
}


