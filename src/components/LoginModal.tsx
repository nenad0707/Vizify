"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LoginForm } from "@/components/login-form";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  standalone?: boolean;  
}

export function LoginModal({ standalone = true }: LoginModalProps) {
  const [open, setOpen] = useState(false);
  
  
  if (standalone) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm w-full p-6 bg-background dark:bg-darkGlassBg backdrop-blur-xl border border-border dark:border-darkBorder rounded-lg shadow-lg">
          <DialogTitle className="sr-only">Sign in to Vizify</DialogTitle>
          <DialogDescription className="sr-only">
            Access your account and manage digital business cards.
          </DialogDescription>
          
          <h1 className="text-2xl font-bold text-center mb-4">
            Sign in to Vizify
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Access your account and manage digital business cards.
          </p>
          
          <LoginForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    );
  }
  
 
  return (
    <DialogContent className="max-w-sm w-full p-6 bg-background dark:bg-darkGlassBg backdrop-blur-xl border border-border dark:border-darkBorder rounded-lg shadow-lg">
      <DialogTitle className="sr-only">Sign in to Vizify</DialogTitle>
      <DialogDescription className="sr-only">
        Access your account and manage digital business cards.
      </DialogDescription>
      
      <h1 className="text-2xl font-bold text-center mb-4">
        Sign in to Vizify
      </h1>
      <p className="text-muted-foreground text-sm text-center mb-6">
        Access your account and manage digital business cards.
      </p>
      
      <LoginForm onSuccess={() => setOpen(false)} />
    </DialogContent>
  );
}