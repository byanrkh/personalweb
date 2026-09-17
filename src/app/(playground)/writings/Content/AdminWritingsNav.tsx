import Link from "next/link";
import { cn } from "@/libs/Cn";

const TABS = [
  { key: "all", label: "All", href: "/writings" },
  { key: "drafts", label: "Drafts", href: "/writings/drafts" },
] as const;

export default function AdminWritingsNav({
  active,
}: {
  active: "all" | "drafts";
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-900 px-4 py-3">
      <nav>
        <ul className="flex items-center gap-4 text-sm">
          {TABS.map((tab) => (
            <li key={tab.key}>
              <Link
                href={tab.href}
                className={cn(
                  "transition-colors duration-200",
                  active === tab.key
                    ? "text-zinc-100 underline underline-offset-4"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Link
        href="/writings/new"
        className="shrink-0 rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-600"
      >
        + New Writing
      </Link>
    </div>
  );
}
