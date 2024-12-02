import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Check, X, AlertTriangle, DollarSign, Flame, Ticket, PlayCircle, CheckCircle2, XCircle } from 'lucide-react'
import { FetchedHabitContract } from '@/types/fetchedHabitContract'
import { Congratulations } from './Congratulations'

interface YourHabitCardProps {
  habit: FetchedHabitContract;
  onCheckIn: (contractId: string, habitVerifier: string, username: string) => Promise<OnCheckInReturnType>;
}

interface OnCheckInReturnType {
  doneToday : boolean;
  habitCompleted : boolean;
}

export function YourHabitCard({ habit, onCheckIn }: YourHabitCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCheckinLoading, setIsCheckinLoading] = useState(false)
  const [checkInSuccess, setCheckInSuccess] = useState(false)
  const [checkInFailed, setCheckInFailed] = useState(false)
  const [showCongratulations, setShowCongratulations] = useState<boolean>(false);

  const progress = (habit.progress.streak / habit.duration) * 100
  const statusIcon = {
    Active: <PlayCircle className="w-4 h-4 mr-1" />,
    Completed: <CheckCircle2 className="w-4 h-4 mr-1" />,
    Failed: <XCircle className="w-4 h-4 mr-1" />
  }

  const handleCheckIn = async () => {
    setIsCheckinLoading(true)
    try {
      const {doneToday, habitCompleted} = await onCheckIn(habit.id, habit.habitVerifier, habit.username)
      console.log('Check-in success:', doneToday)
      if (!doneToday) {
        setCheckInFailed(true)
        setTimeout(() => setCheckInFailed(false), 5000)
      }
      else {
        setCheckInSuccess(true)
        if(habitCompleted){
          setShowCongratulations(true);
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      console.log('Check-in failed:', error)
      setCheckInFailed(true)
      setTimeout(() => setCheckInFailed(false), 5000)
    } finally {
      setIsCheckinLoading(false)
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
                {habit.freePassesAllowed - habit.usedPasses} / {habit.freePassesAllowed}
              </span>
            </div>
            {!habit.dailyCheckin && !checkInSuccess && !checkInFailed && (
              <Button onClick={handleCheckIn} disabled={isCheckinLoading} className="w-full">
                {isCheckinLoading ? 'Verifying...' : 'Check-in Daily Activity'}
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
            {(checkInFailed) && (
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-primary/10 text-primary p-3 rounded-md flex items-center justify-center"
            >
              <X className="w-5 h-5 mr-2" />
              <span>Daily check-in failed! Failed to verify your activity, please try again!</span>
            </motion.div>
            ) }
          </div>
        </DialogContent>
      </Dialog>
      <Congratulations
          isOpen={showCongratulations}
          onClose={() => setShowCongratulations(false)}
          habitTitle={habit.title}
          reward={habit.stakedAmount}
        />
    </>
  )
}

