"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const LivePreview = dynamic(() => import("@/components/LivePreview"), {
  ssr: false,
});

interface FormData {
  name: string;
  title: string;
  color: string;
}

export default function CreateCardPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    title: "",
    color: "#ffffff",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        console.log("Kartica uspešno kreirana");
      } else {
        console.error("Greška pri kreiranju kartice");
      }
    } catch (error) {
      console.error("Greška prilikom slanja zahteva:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="container mx-auto flex-1 flex flex-col py-10">
        <h1 className="text-3xl font-bold mb-8">Create Your Business Card</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <Card className="md:w-1/2 bg-card p-6 border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Card Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter card name"
                    className="mt-1 w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter card title"
                    className="mt-1 w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="mt-1 h-10 w-24 p-0 cursor-pointer"
                  />
                </div>

                <CardFooter className="p-0 mt-4">
                  <Button type="submit" className="w-full">
                    Create Card
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>

          <div className="md:w-1/2 h-[400px] md:h-[500px] bg-muted rounded-lg overflow-hidden shadow-inner">
            <LivePreview formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
