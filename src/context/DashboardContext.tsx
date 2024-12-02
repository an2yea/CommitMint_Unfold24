import React, { createContext, useContext, useState, ReactNode } from 'react';
 import type { HabitType, User } from '@/types';

 interface DashboardContextType {
   activeTab: string;
   selectedHabit: HabitType | null;
   shouldFetchHabits: boolean;
   user: User | null;
   error: string | null;
   setActiveTab: (value: string) => void;
   setSelectedHabit: (habit: HabitType | null) => void;
   setShouldFetchHabits: (value: boolean) => void;
   setUser: (user: User | null) => void;
   setError: (value: string | null) => void;
 }

 const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

 export const DashboardProvider = ({ children }: { children: ReactNode }) => {
   const [activeTab, setActiveTab] = useState<string>("your-habits");
   const [selectedHabit, setSelectedHabit] = useState<HabitType | null>(null);
   const [shouldFetchHabits, setShouldFetchHabits] = useState<boolean>(false);
   const [user, setUser] = useState<User | null>(null);
   const [error, setError] = useState<string | null>(null);
   return (
     <DashboardContext.Provider value={{ user, shouldFetchHabits, activeTab, selectedHabit, error, setUser, setShouldFetchHabits, setActiveTab, setSelectedHabit, setError }}>
       {children}
     </DashboardContext.Provider>
   );
 };

 export const useDashboardContext = () => {
   const context = useContext(DashboardContext);
   if (!context) {
     throw new Error('useDashboardContext must be used within a DashboardProvider');
   }
   return context;
 }; 