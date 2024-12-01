import React from 'react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { TabsContent } from "@/components/ui/tabs";
import { Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import type { HabitType } from "@/types";

// Add interface for component props
interface BrowseHabitsProps {
  habits: HabitType[];
  selectedHabit: HabitType | null;
  setSelectedHabit: (habit: HabitType | null) => void;
  isCreatingHabit: boolean;
  setIsCreatingHabit: (isCreating: boolean) => void;
  onHabitCreationComplete: () => void;
}

const BrowseHabits = ({ 
  habits, 
  selectedHabit, 
  setSelectedHabit, 
  isCreatingHabit, 
  setIsCreatingHabit, 
  onHabitCreationComplete 
}: BrowseHabitsProps) => {
  const handleCardClick = (habit: HabitType) => {
    setSelectedHabit(habit); // Update state outside the rendering flow
  };

  const handleDialogClose = () => {
    setSelectedHabit(null); // Close the dialog when required
  };

  return (
    <TabsContent value="browse-habits">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit, index) => (
            <Dialog key={habit.id}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="cursor-pointer h-full" onClick={() => handleCardClick(habit)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{habit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col h-full justify-between">
                        <p className="text-sm text-muted-foreground mb-4">{habit.subtitle}</p>
                        <div className="flex items-center justify-between mt-auto">
                          {React.createElement(habit.icon, { className: "h-8 w-8 text-primary" })}
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{habit.totalStakers} stakers</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </DialogTrigger>
            </Dialog>
          ))}
        </div>
      </motion.div>
    </TabsContent>
  );
};

export default BrowseHabits; 