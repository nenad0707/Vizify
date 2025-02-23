"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="flex min-h-screen">
      <div className="w-1/2 p-8 border-r">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter card name"
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter card title"
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Color</label>
            <Input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <Button type="submit">Create Card</Button>
        </form>
      </div>

      <div className="w-1/2 p-8">
        <LivePreview formData={formData} />
      </div>
    </div>
  );
}
