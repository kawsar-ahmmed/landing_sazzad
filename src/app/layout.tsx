import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supreme Saree | বাংলার শাড়ি",
  description: "Supreme Saree — বাংলার ঐতিহ্যবাহী শাড়ির অনলাইন ঘর",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="bn"><body>{children}</body></html>;
}
