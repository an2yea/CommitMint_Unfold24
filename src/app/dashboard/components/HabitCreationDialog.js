import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ConfirmHabitCreationDialog from "./ConfirmHabitCreationDialog";

const HabitCreationDialog = ({ selectedHabit, onHabitCreationComplete, isCreatingHabit, setIsCreatingHabit}) => {
  
const initiateHabitCreation = (e) => {
    e.preventDefault();
    setIsCreatingHabit(true);
  };

  const confirmHabitCreation = () => {
    setIsCreatingHabit(false);
    onHabitCreationComplete();
  };

    return (
    <div>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Habit: {selectedHabit?.name}</DialogTitle>
        <DialogDescription>Set up your new habit goal.</DialogDescription>
      </DialogHeader>
      <form onSubmit={initiateHabitCreation}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration (days)
            </Label>
            <Input
              id="duration"
              type="number"
              className="col-span-3"
              min={7}
              max={56}
              step={7}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="freePasses" className="text-right">
              Free Passes
            </Label>
            <Input
              id="freePasses"
              type="number"
              className="col-span-3"
              min={0}
              max={8}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stake" className="text-right">
              Stake Amount ($)
            </Label>
            <Input
              id="stake"
              type="number"
              className="col-span-3"
              min={1}
              step={0.01}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Habit</Button>
        </DialogFooter>
      </form>
    </DialogContent>
    {isCreatingHabit &&  (
        <ConfirmHabitCreationDialog open={isCreatingHabit} onOpenChange={() => setIsCreatingHabit(false)} onConfirm={confirmHabitCreation(onHabitCreationComplete)} />
    )}
    </div>
  );
};

export default HabitCreationDialog; 