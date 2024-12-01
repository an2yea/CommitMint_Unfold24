import { Dialog,DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { TabsContent } from "@/components/ui/tabs";
import HabitCreationDialog from "./HabitCreationDialog";

const BrowseHabits = ({ habits, selectedHabit, setSelectedHabit, isCreatingHabit, setIsCreatingHabit, onHabitCreationComplete }) => {
  const handleCardClick = (habit) => {
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
                  <Card className="cursor-pointer" onClick={() => handleCardClick(habit)}>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <habit.icon className="h-12 w-12 mb-4 text-primary" />
                      <h3 className="text-lg font-semibold text-center">{habit.name}</h3>
                    </CardContent>
                  </Card>
                 { selectedHabit && (
                  <Dialog open={selectedHabit !== null} onOpenChange={handleDialogClose}>
        <HabitCreationDialog selectedHabit={selectedHabit}
                  onHabitCreationComplete={onHabitCreationComplete}
                  isCreatingHabit={isCreatingHabit}
                  setIsCreatingHabit={setIsCreatingHabit} />
      </Dialog>
                 )}

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