import type { Metadata } from "next";
import { League_Spartan, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const spartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-spartan",
  weight: ["400", "500", "600", "700", "800"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://greenworks.genesisflowlabs.com"),
  title: "Book Your Inspection | GreenWorks Inspections",
  description:
    "Schedule your home inspection in minutes. Trusted by 7,000+ homeowners with 4.9-star Google reviews. Serving TX, CO, FL, GA, OH, OK.",
  openGraph: {
    title: "Book Your Home Inspection in Minutes",
    description:
      "The #1 independently-owned inspection company. 4.9 stars, 7,183+ reviews, 2,400+ inspections per month across 6 states.",
    type: "website",
    siteName: "GreenWorks Inspections",
    locale: "en_US",
    url: "https://greenworks.genesisflowlabs.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Your Home Inspection in Minutes",
    description:
      "The #1 independently-owned inspection company. 4.9 stars, 7,183+ reviews across 6 states.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spartan.variable} ${sourceSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
