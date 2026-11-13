import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { images } from "@/data/images";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/sections/Footer";
import { RidgeDefs } from "@/components/ui/Ridge";
import { MotionProvider } from "@/components/motion/MotionProvider";

// Display + body. Variable weight AND width axis (used for narrowed campaign headlines).
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// Technical labels and numerals
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const title = `${site.name} — Electric vehicles in ${site.city}, ${site.country}`;
const description = `Electric vehicles in ${site.city}, ${site.country}. Explore Atlas EV Motors' range, see advertised prices openly, and enquire directly by WhatsApp, phone or email.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}, ${site.city}` },
  description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title,
    description,
    locale: "en_RW",
    images: [{ url: images.hero.src, width: images.hero.width, height: images.hero.height, alt: images.hero.alt }],
  },
  twitter: { card: "summary_large_image", title, description, images: [images.hero.src] },
};

export const viewport: Viewport = {
  themeColor: "#17251f",
  width: "device-width",
  initialScale: 1,
  // lets env(safe-area-inset-*) work, so the sticky enquiry bar clears the iPhone home indicator
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior: Next 16 stops overriding `scroll-behavior: smooth` on route changes
    // unless told to, which would otherwise glide the new page down from the old scroll position.
    <html lang="en" data-scroll-behavior="smooth" className={`${instrument.variable} ${grotesk.variable} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <RidgeDefs />
        <a
          href="#main"
          className="t-label fixed left-4 top-4 z-[100] -translate-y-24 bg-forest px-4 py-3 text-ivory transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
