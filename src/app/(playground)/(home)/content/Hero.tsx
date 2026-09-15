"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";
import Link from "next/link";
import { ArrowRight } from "react-feather";

const GREETINGS = [
  "Hola",
  "Halo",
  "Hello",
  "Bonjour",
  "Ciao",
  "Konnichiwa",
  "Olá",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % GREETINGS.length);
      }, 150);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="space-y-10">
      <div className="flex gap-4 items-center">
        <Link
          href="/about"
          className="bg-fuchsia-400 h-10 w-10 rounded-lg hover:scale-105 transition-all active:scale-100 active:m-1 active:border active: border-dashed"
        ></Link>
        <div>
          <h2 className="text-base text-zinc-400 font-medium flex items-center gap-1.5">
            <span className="inline-block animate-wave origin-[70%_70%]">
              👋
            </span>
            {GREETINGS[index]}
          </h2>
          <h1 className="text-2xl font-medium">
            I'm <span className="text-emerald-400">Abyan Raditya</span>
          </h1>
        </div>
      </div>

      <div className="space-y-4 text-zinc-200 text-base text-justify">
        <p>
          I like building things and figuring out how they work. I’m interested
          in web development, product design, and turning ideas into things
          people can actually use. Outside of code, I enjoy playing guitar,
          exploring music, and working on random projects. Building, learning,
          and exploring.
        </p>
        <p>
          Detail-driven, I strive to build great-looking, user-friendly software
          while enhancing my skills along the way
        </p>
      </div>

      <div className="text-zinc-300 hover:text-zinc-200 flex justify-end">
        <Link
          href="/about"
          className="underline decoration-dashed decoration-1 underline-offset-2 group inline-flex items-center gap-1"
        >
          More about me{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </Container>
  );
}
