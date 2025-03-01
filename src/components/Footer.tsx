"use client";

import Link from "next/link";
import { Github, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-glass/10 backdrop-blur-[4px] border-t border-glass-border py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 text-transparent bg-clip-text inline-block">
              Vizify
            </h3>
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
        <div className="mt-6 pt-6 border-t border-glass-border/50 text-center md:flex md:justify-between md:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Vizify. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="mt-4 md:mt-0 flex justify-center gap-5">
            <Link
              href="https://github.com/vizify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </Link>
            <Link
              href="mailto:info@vizify.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </Link>
            <Link
              href="https://linkedin.com/company/vizify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
