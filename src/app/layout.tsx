import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "শাড়িঘর | বাংলার শাড়ি",
  description: "বাংলার ঐতিহ্যবাহী শাড়ির অনলাইন ঘর",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="bn"><body>{children}</body></html>;
}
