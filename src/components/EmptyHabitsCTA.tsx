import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from 'lucide-react'
import { useDashboardContext } from '@/context/DashboardContext';


export function EmptyHabitsCTA() {
    const { setActiveTab } = useDashboardContext();

    const onStartNow = () => {
        setActiveTab("browse-habits")
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6 pb-2 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Start Your Habit Journey</h2>
              <p className="text-muted-foreground mb-4">
                You haven't signed up for any habits yet. Select from our amazing supported habits and begin your transformation today!
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={onStartNow} className="w-full">
                Start Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        </div>
      )
}