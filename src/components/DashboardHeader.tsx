'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useDashboardContext } from '@/context/DashboardContext';
import { useOkto, OktoContextType } from 'okto-sdk-react';
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";



const DashboardHeader = () => {
  const { user, setUser } = useDashboardContext();
  const {createWallet, logOut: logOutOkto} = useOkto() as OktoContextType;
  const router = useRouter();
  
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      await logOutOkto();
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  async function CreateWallet() {
    try {
      const newWalletData = await createWallet();
      console.log("CreateWallet: Wallet created", newWalletData);
      const response = await fetch(`/api/users/${user?.uid}`, {
        method: 'PUT',
        body: JSON.stringify({ walletAddress: newWalletData.wallets[0].address }),
      });
      if (response.ok) {
        console.log("CreateWallet: Wallet address updated in Firestore");
      } else {
        console.error("CreateWallet: Failed to update wallet address in Firestore");
      }
      
      const userData = await fetch(`/api/users/${user?.uid}`);
      if (userData.ok) {
        const data = await userData.json();
        setUser(data);
        console.log("CreateWallet: User data fetched", data);
      } else {
        console.error("CreateWallet: Failed to fetch user data", userData);
      }
    } catch (error) {
      console.error("CreateWallet: Error creating wallet", error);
    }
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
      <Avatar>
        <AvatarImage src={user?.avatar} alt={user?.username} />
        <AvatarFallback>{user?.username?.split(' ')?.map((n: string) => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <Button
        onClick={handleSignOut}
        className="bg-white text-black hover:bg-gray-100 transition-all duration-200"
      >
        Sign Out
      </Button>
      {user && user.walletAddress ? (
          <Button>Wallet: {user.walletAddress}</Button>
        ) : (
          <Button onClick={CreateWallet}>Create Wallet</Button>
        )}
    </header>
     </motion.div>

  );
};

export default DashboardHeader; 