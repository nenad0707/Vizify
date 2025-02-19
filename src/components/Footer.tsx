"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center md:text-left flex flex-col md:flex-row justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary">Vizify</h3>
          <p className="text-muted-foreground mt-2">
            Create and share digital business cards effortlessly.
          </p>
        </div>
        <div className="flex space-x-6 mt-6 md:mt-0">
          <Link href="/features" className="text-muted-foreground hover:text-primary transition">
            Features
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-primary transition">
            Pricing
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-primary transition">
            About Us
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
