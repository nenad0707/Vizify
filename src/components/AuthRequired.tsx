"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { LoginModal } from "@/components/LoginModal";
import { Dialog } from "@/components/ui/dialog";

interface AuthRequiredProps {
  title: string;
  message: string;
}

export function AuthRequired({ title, message }: AuthRequiredProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md p-8 rounded-xl bg-gradient-to-b from-gradient-start to-gradient-end shadow-lg border border-glass-border backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground mb-6">{message}</p>


        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2.5 mx-auto px-5"
          size="default"
        >
          <LogIn className="h-5 w-5" />
          Sign In
        </Button>
      </motion.div>


      <Dialog open={showModal} onOpenChange={setShowModal}>
        <LoginModal standalone={false} />
      </Dialog>
    </div>
  );
}