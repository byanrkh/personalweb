"use client";

import { cn } from "@/libs/Cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const paths = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Writings", path: "/writings" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="w-full border-b border-zinc-900">
      <div className="mx-auto flex max-w-2xl justify-end px-6 py-6">
        <nav>
          <ul className="flex gap-5 text-sm">
            {paths.map((item) => (
              <li key={item.path}>
                <Link
                  className={cn(
                    "transition-colors duration-200",
                    pathname === item.path
                      ? "text-zinc-100 underline underline-offset-4"
                      : "text-zinc-400 hover:text-zinc-200",
                  )}
                  href={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
