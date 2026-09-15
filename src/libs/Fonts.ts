import { Google_Sans } from "next/font/google";
import { Newsreader } from "next/font/google";

export const googleSans = Google_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const newsreader = Newsreader({
  weight: ["400", "500"],
  style: ["italic", "normal"],
  subsets: ["latin"],
  display: "swap",
});