import { Roboto, Roboto_Flex } from "next/font/google";

export const Headings = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-roboto"
});

export const Body = Roboto_Flex({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-roboto-flex"
});
