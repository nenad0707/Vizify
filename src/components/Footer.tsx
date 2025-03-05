"use client";

import Link from "next/link";
import { Github, Mail, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background backdrop-blur-[4px] border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <Logo />
            <span className="md:hidden text-xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 text-transparent bg-clip-text transition-transform duration-200 hover:scale-105">
              Vizify
            </span>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs">
              Create and share digital business cards effortlessly.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/create"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Create
            </Link>
          </div>
        </div>

        {/* Copyright and Social */}
        <div className="mt-6 pt-6 border-t border-border text-center md:flex md:justify-between md:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Vizify. All rights reserved.
          </p>

          {/* Enhanced Social Icons */}
          <div className="mt-4 md:mt-0 flex justify-center gap-4">
            <Link
              href="https://github.com/vizify"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background text-muted-foreground hover:text-primary transition-all duration-200 p-2 rounded-full border border-border hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5"
              aria-label="GitHub"
            >
              <Github size={16} />
            </Link>
            <Link
              href="mailto:info@vizify.com"
              className="bg-background text-muted-foreground hover:text-primary transition-all duration-200 p-2 rounded-full border border-border hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5"
              aria-label="Email"
            >
              <Mail size={16} />
            </Link>
            <Link
              href="https://linkedin.com/company/vizify"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background text-muted-foreground hover:text-primary transition-all duration-200 p-2 rounded-full border border-border hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}