import Link from "next/link";
import React from "react";

const LINKS = [
  { label: "Email", href: "mailto:hello@byanrkh.com" },
  { label: "GitHub", href: "https://github.com/byanrkh" },
  { label: "LinkedIn", href: "https://linkedin.com/in/byanrkh" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Abyan Raditya</p>
        <div className="flex gap-5">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="transition-colors hover:text-zinc-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
