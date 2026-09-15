import Container from "@/components/Container";
import PageHeading from "@/components/Heading";
import { newsreader } from "@/libs/Fonts";
import React from "react";

const STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Supabase",
  "Vercel",
];

export default function AboutPage() {
  return (
    <Container className="space-y-10 py-20">
      <PageHeading
        title="About"
        description="A bit more about who I am and what I do."
      />

      <div className="space-y-4 text-base text-zinc-300">
        <p>
          I&apos;m Abyan, a developer based in Indonesia who likes turning rough
          ideas into things people can actually click, use, and hopefully enjoy.
          Most of my time goes into the web — building interfaces, shaping
          product details, and sweating over spacing that only I will ever
          notice.
        </p>
        <p>
          When I&apos;m not writing code, I&apos;m usually playing guitar,
          listening to something new, or pulling apart a side project just to
          see how it&apos;s built.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm text-zinc-500">Currently working with</h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {STACK.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-zinc-800 px-3 py-1 text-zinc-300"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
