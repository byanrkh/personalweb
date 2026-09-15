import { newsreader } from "@/libs/Fonts";
import React from "react";

export default function PageHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className={`text-3xl italic text-zinc-50 ${newsreader.className}`}>
        {title}
      </h1>
      {description ? <p className="text-zinc-500">{description}</p> : null}
    </div>
  );
}
