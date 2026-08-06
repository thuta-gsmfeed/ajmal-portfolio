import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ajmalgholzad.com"),
  title: "Ajmal Gholzad — Entrepreneur & Technology Founder",
  description: "An innovative entrepreneur, turning challenges into impactful solutions.",
  openGraph: { title:"Ajmal Gholzad", description:"An innovative entrepreneur, turning challenges into impactful solutions.", type:"website" },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
