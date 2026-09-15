import Container from "@/components/Container";
import Link from "next/link";
import { newsreader } from "@/libs/Fonts";

export default function Hero() {
  return (
    <Container className="space-y-8 py-24">
      <p className="text-base text-zinc-500">Hi, I&apos;m</p>
      <h1 className={`text-4xl italic text-zinc-50 ${newsreader.className}`}>
        Abyan Raditya
      </h1>

      <p className="max-w-md text-base text-zinc-400">
        I build things for the web and figure out how they should work along the
        way. Outside of code, mostly guitar and side projects.
      </p>

      <Link
        href="/about"
        className="inline-block text-sm text-zinc-500 underline decoration-dashed underline-offset-4 hover:text-zinc-200"
      >
        More about me
      </Link>
    </Container>
  );
}
