import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { User } from "@/types";

interface DashboardHeaderProps {
  user: User;
  handleSignOut: () => void;
  userData: User;
}

const DashboardHeader = ({ user, handleSignOut, userData }: DashboardHeaderProps) => {
  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Welcome, {user.username}</h1>
      <Avatar>
        <AvatarImage src={userData.avatar} alt={userData.username} />
        <AvatarFallback>{userData.username.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <Button
        onClick={handleSignOut}
        className="bg-white text-black hover:bg-gray-100 transition-all duration-200"
      >
        Sign Out
      </Button>
    </header>
     </motion.div>

  );
};

export default DashboardHeader; 