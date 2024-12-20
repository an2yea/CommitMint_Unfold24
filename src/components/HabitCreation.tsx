import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Check, ChevronRight, Calendar, Ticket, Coins, User, Loader2 } from 'lucide-react'
import type { HabitType } from '@/types'
import { useDashboardContext } from '@/context/DashboardContext';

interface FormData {
  days: number
  freePasses: number
  stake: number
  username: string
}

export function HabitCreationFlow() {
  // States
  const { user, setUser } = useDashboardContext();
  const [step, setStep] = useState<number>(0)
  const [formData, setFormData] = useState<FormData>({
    days: 7,
    freePasses: 1,
    stake: 10,
    username: '',
  })
  const { selectedHabit, setActiveTab, setSelectedHabit, setShouldFetchHabits } = useDashboardContext();
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'stake') {
      const stakeAmount = parseFloat(value)
      if (stakeAmount < 0) {
        setError('Stake amount cannot be negative')
        return
      }
      if (stakeAmount > (user?.tokenBalance ?? 0)) {
        setError(`Stake amount cannot exceed your balance of ${user?.tokenBalance} tokens`)
      } else {
        setError('')
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'username' && value.trim() !== '') {
      setError('')
    }
  }

  const handleSliderChange = (name: keyof FormData, value: number[]) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }))
  }

  const handleActivityStepNext = () => {
    if (step === 3) {
      if (formData.username.trim() === '') {
        setError(`${selectedHabit?.habitVerifier} username is required to verify your activity!`)
        return
      }
    }
    if (step === 2) {
      const stakeAmount = parseFloat(formData.stake.toString())
      if (isNaN(stakeAmount) || stakeAmount <= 0) {
        setError('Please enter a valid positive stake amount')
        return
      }
      if (stakeAmount > (user?.tokenBalance ?? 0)) {
        setError(`Stake amount cannot exceed your balance of ${user?.tokenBalance} tokens`)
        return
      }
    }
    if (step < 3) {
      setStep(prev => prev + 1)
    } else {
      setIsConfirming(true)
    }
    setError('')
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1)
    }
    setError('')
  }

  const handleConfirm = async () => {
    setIsConfirming(false)
    setIsLoading(true)
    await createHabitContract()
    setIsLoading(false)
    setIsSuccess(true)
    setTimeout(() => {
      onHabitCreationComplete()
      handleDialogClose()
    }, 3000)
  }

  const handleDialogClose = () => {
    setStep(0)
    setFormData({
      days: 7,
      freePasses: 1,
      stake: 10,
      username: '',
    })
    setIsConfirming(false)
    setIsSuccess(false)
    setError('')
    setSelectedHabit(null)
    setIsLoading(false)
  }

  const onHabitCreationComplete = () => {
    setSelectedHabit(null)
    setIsConfirming(false)
    setIsSuccess(false)
    setActiveTab("your-habits")
    setShouldFetchHabits(true)
  }

  const createHabitContract = async (): Promise<void> => {
    const habitContractData = {
      userId: user?.uid,
      habitId: selectedHabit?.id,
      habitVerifier: selectedHabit?.habitVerifier,
      username: formData.username,
      days: formData.days,
      freePasses: formData.freePasses,
      stake: formData.stake,
      title: selectedHabit?.title,
      subtitle: selectedHabit?.subtitle,
      nft: selectedHabit?.nft
    };
    try {
      const response = await fetch('/api/habitcontracts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habitContractData),
      });

      if (!response.ok) {
        setError('Failed to create habit contract. Please try again.');
        setTimeout(() => {
          handleDialogClose()
        }, 3000)
        // throw new Error('Failed to create habit contract');
      }
    } catch (error) {
      setError('Failed to create habit contract. Please try again.');
      setTimeout(() => {
        handleDialogClose()
      }, 3000)
      //throw new Error('Failed to create habit contract');
    }
  }

  interface Step {
    title: string
    description: string
    icon: React.ElementType
    content: JSX.Element
  }

  const steps: Step[] = [
    {
      title: "Commit Duration",
      description: "How many days do you want to commit to this habit?",
      icon: Calendar,
      content: (
        <div className="space-y-4">
          <Slider
            name="days"
            min={7}
            max={30}
            step={1}
            value={[formData.days]}
            onValueChange={(value) => handleSliderChange('days', value)}
          />
          <div className="text-center text-2xl font-bold">{formData.days} days</div>
        </div>
      ),
    },
    {
      title: "Free Passes",
      description: "How many free passes do you want? (Max 5)",
      icon: Ticket,
      content: (
        <div className="space-y-4">
          <Slider
            name="freePasses"
            min={0}
            max={5}
            step={1}
            value={[formData.freePasses]}
            onValueChange={(value) => handleSliderChange('freePasses', value)}
          />
          <div className="text-center text-2xl font-bold">{formData.freePasses} passes</div>
        </div>
      ),
    },
    {
      title: "Stake Amount",
      description: "How much do you want to stake?",
      icon: Coins,
      content: (
        <div className="space-y-2">
          <Label htmlFor="stake">Stake Amount ($)</Label>
          <Input
            id="stake"
            name="stake"
            type="number"
            min={1}
            max={user?.tokenBalance}
            step={0.01}
            value={formData.stake}
            onChange={handleInputChange}
            className="text-lg"
          />
          <p className="text-sm text-muted-foreground">
            Available Balance: {user?.tokenBalance} tokens
          </p>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      ),
    },
    {
      title: `${(selectedHabit?.habitVerifier ?? '').charAt(0).toUpperCase() + (selectedHabit?.habitVerifier ?? '').slice(1)} Username`,
      description: `Enter your ${(selectedHabit?.habitVerifier ?? '').charAt(0).toUpperCase() + (selectedHabit?.habitVerifier ?? '').slice(1)} username for activity tracking`,
      icon: User,
      content: (
        <div className="space-y-2">
          <Label htmlFor="username">{`${(selectedHabit?.habitVerifier ?? '').charAt(0).toUpperCase() + (selectedHabit?.habitVerifier ?? '').slice(1)} Username`}</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            className="text-lg"
            required
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      ),
    },
  ]

  return (
    <Dialog open={selectedHabit !== null} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <AnimatePresence mode="wait">
          {!isConfirming && !isLoading && !isSuccess && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle>{selectedHabit?.title}</DialogTitle>
                <DialogDescription>{selectedHabit?.subtitle}</DialogDescription>
              </DialogHeader>
              <div className="mt-4 mb-4">
                <div className="relative flex justify-between mb-4">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-secondary -translate-y-1/2" />
                  <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-300 ease-in-out" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
                  {steps.map((_, index) => (
                    <div key={index} className="z-10">
                      <div
                        className={`w-6 h-6 rounded-full ${index <= step ? 'bg-primary' : 'bg-secondary'
                          } flex items-center justify-center transition-all duration-300 ease-in-out`}
                      >
                        {index < step && (
                          <Check className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center mb-4">
                  {React.createElement(steps[step].icon, { className: "w-6 h-6 mr-2 text-primary" })}
                  <h3 className="text-lg font-semibold">{steps[step].title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{steps[step].description}</p>
                {steps[step].content}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleBack} disabled={step === 0}>
                  Back
                </Button>
                <Button onClick={handleActivityStepNext}>
                  {step < 3 ? 'Next' : 'Review'} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {isConfirming && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle>Confirm Your Habit Contract</DialogTitle>
                <DialogDescription>Please review your habit details</DialogDescription>
              </DialogHeader>
              <div className="mt-4 mb-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Duration:</span>
                  <span>{formData.days} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Free Passes:</span>
                  <span>{formData.freePasses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Stake Amount:</span>
                  <span>${formData.stake}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{`${selectedHabit?.habitVerifier} Username:`}</span>
                  <span>{formData.username}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirming(false)}>
                  Edit
                </Button>
                <Button onClick={handleConfirm}>
                  Confirm and Create
                </Button>
              </DialogFooter>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex flex-col items-center justify-center h-64"
            >
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
              <h2 className="text-2xl font-bold mb-2">Creating Habit Contract</h2>
              <p className="text-center text-muted-foreground">
                Please wait while we set up your new habit...
              </p>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex flex-col items-center justify-center h-64"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Check className="w-16 h-16 text-green-500 mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Habit Contract Created!</h2>
              <p className="text-center text-muted-foreground">
                Your journey to {selectedHabit?.title} starts today. All the best!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}