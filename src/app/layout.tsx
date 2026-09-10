import type { Metadata, Viewport } from "next";
import { SectionTransitions } from "@/components/animation/SectionTransitions";
import { SmoothScroll } from "@/components/animation/SmoothScroll";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#030506",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gholzad.com"),
  title: {
    default: "Ajmal Gholzad — Innovative Entrepreneur & Technology Founder",
    template: "%s | Ajmal Gholzad",
  },
  description:
    "Ajmal Gholzad is an innovative global entrepreneur and technology founder with 15+ years of experience building high-impact businesses across AI software, e-commerce, and international distribution.",
  keywords: [
    "Ajmal Gholzad",
    "Gholzad Management Group",
    "Entrepreneur",
    "Technology Founder",
    "AI Software",
    "Global Business",
    "iPhone Distribution",
    "Digital Commerce",
    "Dubai Entrepreneur",
    "Venture Capital",
  ],
  authors: [{ name: "Ajmal Gholzad", url: "https://www.gholzad.com" }],
  creator: "Ajmal Gholzad",
  publisher: "Gholzad Management Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Ajmal Gholzad — Innovative Entrepreneur & Technology Founder",
    description:
      "An innovative entrepreneur, turning challenges into impactful solutions across global markets.",
    url: "https://www.gholzad.com",
    siteName: "Ajmal Gholzad Official Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Ajmal Gholzad — Entrepreneur and Technology Founder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ajmal Gholzad — Innovative Entrepreneur & Technology Founder",
    description:
      "An innovative entrepreneur, turning challenges into impactful solutions across global markets.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.gholzad.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ajmal Gholzad",
    url: "https://www.gholzad.com",
    image: "https://www.gholzad.com/images/about/about.JPG",
    jobTitle: "Entrepreneur & Technology Founder",
    worksFor: {
      "@type": "Organization",
      name: "Gholzad Management Group",
    },
    description:
      "Innovative entrepreneur turning challenges into impactful solutions across AI, digital commerce, and global markets.",
    knowsAbout: [
      "Artificial Intelligence",
      "E-Commerce",
      "International Trade",
      "Entrepreneurship",
      "Software Development",
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body><SmoothScroll><SectionTransitions />{children}</SmoothScroll></body>
    </html>
  );
}
