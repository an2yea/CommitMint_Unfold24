import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from 'lucide-react'

interface FailureProps {
  isOpen: boolean
  onClose: () => void
  habitTitle: string
}

export function Failure({ isOpen, onClose, habitTitle }: FailureProps) {

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Habit Failed</DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <X className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <p className="text-lg mb-4">
                You missed completing <span className="font-semibold">{habitTitle}</span> this time, but that's okay.
              </p>
              <p className="text-lg mb-4">
              Every step you take brings you closer to success. Keep showing up—you're doing great!
              </p>
              <p className="text-sm text-muted-foreground">
                Try again—we're ready when you are.
              </p>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
