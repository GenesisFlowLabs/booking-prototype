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
  title: "Book Your Inspection | GreenWorks Inspections",
  description:
    "Schedule your home inspection in minutes. Trusted by 7,000+ homeowners with 4.9-star Google reviews. Serving TX, CO, FL, GA, OH, OK.",
  openGraph: {
    title: "Book Your Inspection | GreenWorks Inspections",
    description:
      "Schedule your home inspection in minutes. 4.9-star rating, 2,400+ inspections per month.",
    type: "website",
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
