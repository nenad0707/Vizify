import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="text-3xl font-bold text-primary">Welcome to Vizify!</h1>
      <ThemeToggle />
    </main>
  );
}
