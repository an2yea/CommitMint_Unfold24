import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DashboardHeader = ({ user, handleSignOut, userData }) => {
  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Welcome, {user.displayName}</h1>
      <Avatar>
        <AvatarImage src={userData.avatar} alt={userData.name} />
        <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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