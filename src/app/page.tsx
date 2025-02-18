import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral text-foreground flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">Welcome to Vizify</h1>
      <Button className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-md">
        Get Started
      </Button>
    </main>
  );
}
