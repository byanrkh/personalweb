"use client";

import { logout } from "@/app/login/action";
import { cn } from "@/libs/Cn";
import { newsreader } from "@/libs/Fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";

const paths = [
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Writings", path: "/writings" },
];

export default function Navbar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <header className="w-full border-b border-zinc-900">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className={`text-xl italic text-zinc-50 ${newsreader.className}`}
        >
          byanrkh
        </Link>
        <nav>
          <ul className="flex items-center gap-5 text-sm">
            {paths.map((item) => (
              <li key={item.path}>
                <Link
                  className={cn(
                    "transition-colors duration-200",
                    pathname === item.path
                      ? "text-zinc-100 underline underline-offset-4 hover:underline-offset-8 transition-all"
                      : "text-zinc-400 hover:text-zinc-200",
                  )}
                  href={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isAdmin ? (
              <li>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-zinc-500 transition-colors hover:text-zinc-200"
                  >
                    Logout
                  </button>
                </form>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    </header>
  );
}
