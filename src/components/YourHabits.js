import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, DollarSign, Ticket, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";

const YourHabits = ({ habits }) => {
  return (
    <TabsContent value="your-habits">
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
    </TabsContent>
  );
};

export default YourHabits; 