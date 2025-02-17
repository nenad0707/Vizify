"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Mail, LogIn } from "lucide-react";

export function LoginForm({
  className,
  onSuccess = () => {},
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      redirect: false,
    });

    if (result?.ok) {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full flex items-center gap-2"
          disabled={loading}
        >
          <LogIn className="h-5 w-5" />
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => signIn("github").then(() => onSuccess())}
        >
          <Github className="h-5 w-5" />
          GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => signIn("google").then(() => onSuccess())}
        >
          <Mail className="h-5 w-5" />
          Google
        </Button>
      </div>
    </div>
  );
}
