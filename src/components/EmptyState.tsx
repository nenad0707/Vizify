import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/router" 

export function EmptyState() {

  const handleNewCard = () => {
     router.push("/create");
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/30 rounded-lg border border-dashed border-border mt-8"
    >
      <div className="rounded-full bg-muted p-4 mb-4">
        <PlusCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No business cards yet</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        You haven't created any business cards yet. Start by creating your first digital business card.
      </p>
      <Button onClick={ handleNewCard } className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all shadow-md">
        Create Your First Card
      </Button>
    </motion.div>
  );
}
