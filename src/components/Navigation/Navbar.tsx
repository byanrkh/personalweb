"use client";

import { cn } from "@/libs/Cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const paths = [
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Writings", path: "/writings" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-medium">
          byanrkh
        </Link>
        <nav>
          <ul className="flex gap-5 text-sm">
            {paths.map((item, index) => (
              <li key={index}>
                <Link
                  className={cn(
                    "transition-all duration-200",
                    pathname === item.path
                      ? "underline underline-offset-2 hover:underline-offset-4"
                      : "text-zinc-400 hover:text-zinc-300",
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
