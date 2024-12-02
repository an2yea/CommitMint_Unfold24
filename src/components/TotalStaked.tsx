import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Adjust imports as necessary
import { DollarSign } from 'lucide-react'; // Ensure this import is correct
import { useDashboardContext } from '@/context/DashboardContext';


const TotalStaked = () => {
  const { shouldFetchHabits, user } = useDashboardContext();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Total Staked</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold flex items-center">
            <DollarSign className="mr-2" />
            {user?.stakedAmount}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TotalStaked; 