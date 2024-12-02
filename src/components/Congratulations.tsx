import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy, Coins, X } from 'lucide-react'

interface CongratulationsProps {
  isOpen: boolean
  onClose: () => void
  habitTitle: string
  reward: number
}

export function Congratulations({ isOpen, onClose, habitTitle, reward }: CongratulationsProps) {

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Congratulations!</DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary animate-bounce" />
              <p className="text-lg mb-4">
                You've successfully completed <span className="font-semibold">{habitTitle}</span>!
              </p>
              <div className="flex items-center justify-center text-2xl font-bold text-primary mb-4">
                <Coins className="w-8 h-8 mr-2" />
                <span>{reward.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your reward has been added to your account.
              </p>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
