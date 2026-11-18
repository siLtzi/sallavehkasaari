import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salla Vehkasaari | Valokuvaaja",
  description: "Luonnollista henkilö-, pari-, perhe- ja hääkuvausta. Salla Vehkasaari, Pirkkala ja Tampere.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fi"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&family=Nothing+You+Could+Do&display=swap" rel="stylesheet" /></head><body>{children}</body></html>;
}
