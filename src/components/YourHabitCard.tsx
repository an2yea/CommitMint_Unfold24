import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Check, X, AlertTriangle, DollarSign, Flame, Ticket, PlayCircle, CheckCircle2, XCircle } from 'lucide-react'
import { HabitContract } from '@/types/habit_contract';

interface YourHabitCardProps {
  habit: HabitContract;
  onCheckIn: (contractId: string, habitVerifier: string, username: string) => Promise<void>;
}

export function YourHabitCard({ habit, onCheckIn }: YourHabitCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [checkInSuccess, setCheckInSuccess] = useState(false)

  const progress = (habit.progress.streak / habit.duration) * 100
  const statusIcon = {
    Active: <PlayCircle className="w-4 h-4 mr-1" />,
    Completed: <CheckCircle2 className="w-4 h-4 mr-1" />,
    Failed: <XCircle className="w-4 h-4 mr-1" />
  }

  const handleCheckIn = async () => {
    setIsChecking(true)
    try {
      await onCheckIn(habit.contractId, habit.habitVerifier, habit.username)
      setCheckInSuccess(true)
    } catch (error) {
      console.error('Check-in failed:', error)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <Card className={`overflow-hidden`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{habit.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{habit.subtitle}</p>
              </div>
              <Badge variant="outline" className="font-normal">
                {statusIcon[habit.status]}
                {habit.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold flex items-center">
                <DollarSign className="w-5 h-5 mr-1" />
                {habit.stakedAmount}
              </span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Flame className="w-4 h-4 mr-1" />
                {habit.progress.streak}/{habit.duration} days
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            <div className="mt-2 flex justify-between items-center">
              {habit.dailyCheckin ? (
                  <span className="text-sm flex items-center text-muted-foreground">
                    <Check className="w-4 h-4 mr-1 text-500" />
                    Checked in!
                  </span>
                ) : (
                  <span className="text-sm flex items-center text-muted-foreground">
                    <AlertTriangle className="w-4 h-4 mr-1 text-500" />
                    Check-in pending!
                  </span>
                )}
              {!habit.dailyCheckin && (
                <Badge variant="outline" className="text-grey-500 border-black-500">
                  Pending
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{habit.title}</DialogTitle>
            <DialogDescription>{habit.subtitle}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Streak Progress</h4>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {habit.progress.streak} days out of {habit.duration} day goal
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Amount Staked:</span>
              <span>${habit.stakedAmount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Free Passes Left:</span>
              <span className="flex items-center">
                <Ticket className="w-4 h-4 mr-1" />
                {habit.freePassesAllowed - habit.usedPasses}
              </span>
            </div>
            {!habit.dailyCheckin && !checkInSuccess && (
              <Button onClick={handleCheckIn} disabled={isChecking} className="w-full">
                {isChecking ? 'Verifying...' : 'Check-in Daily Activity'}
              </Button>
            )}
            {(habit.dailyCheckin || checkInSuccess) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-primary/10 text-primary p-3 rounded-md flex items-center justify-center"
                >
                  <Check className="w-5 h-5 mr-2" />
                  <span>Daily check-in completed!</span>
                </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

