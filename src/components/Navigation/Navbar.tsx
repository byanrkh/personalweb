"use client";

import { logout } from "@/app/login/action";
import { cn } from "@/libs/Cn";
import { newsreader } from "@/libs/Fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "react-feather";

const paths = [
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Writings", path: "/writings" },
];

export default function Navbar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + close on Escape while menu is open
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="relative z-50 w-full border-b border-zinc-900">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className={`text-xl italic text-zinc-50 ${newsreader.className}`}
          onClick={() => setOpen(false)}
        >
          byanrkh
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
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

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="relative z-50 flex h-9 w-9 items-center justify-center text-zinc-300 transition-colors hover:text-zinc-50 md:hidden"
        >
          <span className="relative block h-5 w-5">
            <Menu
              size={20}
              className={cn(
                "absolute inset-0 transition-all duration-300 ease-out",
                open
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100",
              )}
            />
            <X
              size={20}
              className={cn(
                "absolute inset-0 transition-all duration-300 ease-out",
                open
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0",
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 top-0 z-40 bg-[#0c0f0d]/98 backdrop-blur-sm transition-opacity duration-300 ease-out md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav className="flex h-full flex-col justify-center px-8">
          <ul className="space-y-6">
            {paths.map((item, i) => (
              <li
                key={item.path}
                className={cn(
                  "transition-all duration-300 ease-out",
                  open
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0",
                )}
                style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
              >
                <Link
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    `block text-3xl italic ${newsreader.className}`,
                    pathname === item.path
                      ? "text-zinc-50 underline decoration-1 underline-offset-8"
                      : "text-zinc-500 hover:text-zinc-200",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {isAdmin ? (
              <li
                className={cn(
                  "pt-2 transition-all duration-300 ease-out",
                  open
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0",
                )}
                style={{
                  transitionDelay: open ? `${80 + paths.length * 60}ms` : "0ms",
                }}
              >
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-300"
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
