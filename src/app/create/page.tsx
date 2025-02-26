"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/LoginModal";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const LivePreview = dynamic(() => import("@/components/LivePreview"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-card/30 rounded-lg">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface FormData {
  name: string;
  title: string;
  color: string;
  template: "modern" | "classic" | "minimalist";
}

export default function CreateCardPage() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    title: "",
    color: "#6366f1",
    template: "modern",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTemplateChange = (template: "modern" | "classic" | "minimalist") => {
    setFormData({ ...formData, template });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create card");
      }

      const newCard = await res.json();
      setStatusMessage({
        type: 'success',
        message: "Your business card has been created successfully."
      });
      // Redirect or clear form
    } catch (error) {
      console.error("Error submitting request:", error);
      setStatusMessage({
        type: 'error',
        message: "Your card could not be created. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-gradient-start to-gradient-end rounded-xl p-8 shadow-lg border border-glass-border backdrop-blur-sm max-w-md w-full text-center"
        >
          <h2 className="text-2xl font-bold mb-3">Create Your Digital Business Card</h2>
          <p className="text-muted-foreground mb-6">You need to be signed in to create and manage your business cards.</p>
          <LoginModal />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors group">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>
      
      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">Create Your Business Card</h1>
          <p className="text-muted-foreground max-w-2xl">Design your professional digital business card. Customize details and preview in real-time with our 3D card viewer.</p>
        </motion.div>
        
        {statusMessage && (
          <div className={`p-4 mb-4 rounded-lg border ${
            statusMessage.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {statusMessage.message}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="order-2 lg:order-1"
          >
            <Card className="bg-card/70 backdrop-blur-sm border border-border/50 shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Card Designer
                </CardTitle>
                <CardDescription>
                  Customize your card details and appearance
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name"
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          placeholder="John Smith" 
                          className="transition-all border-border/60 focus:border-primary" 
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="title">Job Title</Label>
                        <Input 
                          id="title"
                          name="title" 
                          value={formData.title} 
                          onChange={handleChange} 
                          placeholder="Product Manager" 
                          className="transition-all border-border/60 focus:border-primary" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Appearance</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="color">Card Color</Label>
                        <div className="flex items-center gap-3 mt-1.5">
                          <Input 
                            type="color" 
                            id="color"
                            name="color" 
                            value={formData.color} 
                            onChange={handleChange} 
                            className="h-10 w-20 p-1 cursor-pointer rounded-md" 
                          />
                          <div className="text-sm font-mono text-muted-foreground">
                            {formData.color.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Label className="mb-2 block">Card Template</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {['modern', 'classic', 'minimalist'].map((template) => (
                            <div 
                              key={template}
                              onClick={() => handleTemplateChange(template as any)}
                              className={`
                                relative cursor-pointer rounded-lg border p-2 text-center text-sm capitalize transition-all
                                ${formData.template === template 
                                  ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                                  : 'border-border/40 bg-muted/40 hover:bg-muted/80 text-muted-foreground'}
                              `}
                            >
                              {template}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.name || !formData.title}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Business Card'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="order-1 lg:order-2"
          >
            <Card className="bg-card/70 backdrop-blur-sm border border-border/50 shadow-lg h-[500px] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">Live Preview</CardTitle>
                <CardDescription>
                  Interactive 3D preview of your card
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <LivePreview formData={formData} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}