import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { YourHabitCard } from "./YourHabitCard";
import { EmptyHabitsCTA } from './EmptyHabitsCTA';

const YourHabits = ({ user, activeTab, setActiveTab }) => {

  const [statusFilter, setStatusFilter] = useState('All')
  const [habits, setHabits] = useState([])
  const [error, setError] = useState(null); // To handle errors
  const [isLoading, setIsLoading] = useState(true)

    // Fetch habits from the API endpoint
    useEffect(() => {
      const fetchHabits = async () => {
        if (!user?.uid) return;
    
        setIsLoading(true);
        setError(null);
    
        try {
          const response = await fetch(`/api/habitcontracts/get/${user.uid}`);
    
          if (!response.ok) {
            throw new Error('Failed to fetch habits');
          }
    
          const data = await response.json();
          console.log("Habits are", data)
          setHabits(data || []); // Assuming the API returns habits in a "habits" array
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHabits();
    }, [user?.uid, activeTab]);

  // Filter habits based on status
  useEffect(() => {
    if (statusFilter === 'All') {
      setHabits((prev) => prev); // No filtering, show all habits
    } else {
      setHabits((prev) => prev.filter(habit => habit.status === statusFilter));
    }
  }, [statusFilter]);

  const handleCheckIn = async (contractId, habitVerifier, username) => {
  try {
    const response = await fetch(`/api/verify/${habitVerifier}/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contractId, username }),
    });

    const data = await response.json();
    console.log('Response from verify API:', data);

    if (response.ok) {
      if(data.doneToday) {
        console.log('Habit verified successfully');
        setHabits(habits.map(habit => 
          habit.id === contractId ? { ...habit, dailyCheckin: true } : habit
        ));
      }
      else{
        console.log('Habit not verified');
      }

    } else {
      console.log('Error verifying habit:', data.error);
    }
  } catch (err) {
    console.log('Error making verify API call:', err);
  }
};

  const handleStartNow = () => {
    setActiveTab("browse-habits")
  }

  return (
    <TabsContent value="your-habits">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : habits.length === 0 ? (
              <EmptyHabitsCTA onStartNow={handleStartNow} />
            ) : (
              <>
                  <div className="mb-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Habits</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {habits.map((habit, index) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <YourHabitCard key={habit.id} habit={habit} onCheckIn={handleCheckIn} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              </>
            )}
      </motion.div>
    </TabsContent>
  );
};

export default YourHabits; 