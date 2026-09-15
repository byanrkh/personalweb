import type { Metadata } from "next";
import { googleSans } from "@/libs/Fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abyan Raditya",
  description:
    "Personal site of Abyan Raditya — builder, developer, and product tinkerer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`min-h-full flex flex-col ${googleSans.className}`}>
        {children}
      </body>
    </html>
  );
}
