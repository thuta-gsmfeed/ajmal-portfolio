import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ajmalgholzad.com"),
  title: "Ajmal Gholzad — Entrepreneur & Technology Founder",
  description: "Building businesses, connecting global markets, and creating technology products since 2009.",
  openGraph: { title:"Ajmal Gholzad", description:"Building businesses. Connecting markets. Creating the future.", type:"website" },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
