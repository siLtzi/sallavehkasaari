import type { Metadata } from "next";
import { getHomeContent } from "../lib/sanity";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { texts } = await getHomeContent();
  return {
    title: texts.metadataTitle,
    description: texts.metadataDescription,
    robots: { index: false, follow: false },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fi"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;600&family=Jost:wght@300&display=swap" rel="stylesheet" /></head><body>{children}</body></html>;
}
