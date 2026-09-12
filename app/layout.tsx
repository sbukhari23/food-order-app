import type { Metadata } from "next";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/500.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/700.css";
import Providers from "@/components/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ReactFood | Dinner, considered",
    template: "%s | ReactFood",
  },
  description:
    "A considered menu of comfort food, bright bowls, and late-night favorites.",
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "https://example.com"),
  openGraph: {
    title: "ReactFood | Dinner, considered",
    description:
      "A considered menu of comfort food, bright bowls, and late-night favorites.",
    images: ["/logo.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReactFood",
    description: "Dinner, considered.",
    images: ["/logo.jpg"],
  },
  icons: { icon: "/logo.jpg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
