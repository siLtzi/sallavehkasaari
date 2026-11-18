import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salla Vehkasaari | Valokuvaaja",
  description: "Luonnollista henkilö-, pari-, perhe- ja hääkuvausta. Salla Vehkasaari, Pirkkala ja Tampere.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fi"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=DM+Sans:wght@400;500;600&family=Dorsa&family=Poiret+One&display=swap" rel="stylesheet" /></head><body>{children}</body></html>;
}
