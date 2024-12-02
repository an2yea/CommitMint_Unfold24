import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Adjust imports as necessary
import { ImageIcon, Coins } from 'lucide-react'; // 
import { useDashboardContext } from '@/context/DashboardContext';
import { NFTModal } from './NFTModal';
const TotalStaked = () => {
  const { user } = useDashboardContext();
  const [showNFTModal, setShowNFTModal] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="mb-8">
      <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Total Staked</h2>
                  <p className="text-4xl font-bold flex items-center">
                    <Coins className="mr-2" />
                    {user?.stakedAmount || 0}
                  </p>
                </div>
                <div 
                  className="flex flex-col items-center justify-end cursor-pointer transition-colors hover:bg-secondary/10 rounded-lg p-4"
                  onClick={() => setShowNFTModal(true)}
                >
                  <ImageIcon className="h-10 w-10 mb-2" />
                  <span className="text-lg font-semibold">View NFTs</span>
                </div>
              </div>
            </CardContent>
      </Card>
      <NFTModal
          isOpen={showNFTModal}
          onClose={() => setShowNFTModal(false)}
          nfts={user?.nfts}
        />
    </motion.div>
  );
};

export default TotalStaked; 