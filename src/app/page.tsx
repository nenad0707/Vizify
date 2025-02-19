import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main className="bg-neutral text-foreground">
      <Hero />
      <Features/>
      <FAQ />
    </main>
  );
}
