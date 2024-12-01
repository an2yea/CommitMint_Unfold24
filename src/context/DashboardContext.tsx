import React, { createContext, useContext, useState, ReactNode } from 'react';
 import type { HabitType, User } from '@/types';

 interface DashboardContextType {
   activeTab: string;
   selectedHabit: HabitType | null;
   shouldFetchHabits: boolean;
   user: User | null;
   setUser: (user: User | null) => void;
   setShouldFetchHabits: (value: boolean) => void;
   setActiveTab: (value: string) => void;
   setSelectedHabit: (habit: HabitType | null) => void;
 }

 const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

 export const DashboardProvider = ({ children }: { children: ReactNode }) => {
   const [activeTab, setActiveTab] = useState<string>("your-habits");
   const [selectedHabit, setSelectedHabit] = useState<HabitType | null>(null);
   const [shouldFetchHabits, setShouldFetchHabits] = useState<boolean>(false);
   const [user, setUser] = useState<User | null>(null);
   return (
     <DashboardContext.Provider value={{ user, shouldFetchHabits, activeTab, selectedHabit, setUser, setShouldFetchHabits, setActiveTab, setSelectedHabit }}>
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