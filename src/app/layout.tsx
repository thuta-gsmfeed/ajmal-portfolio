import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#030506",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ajmalgholzad.com"),
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
  authors: [{ name: "Ajmal Gholzad", url: "https://ajmalgholzad.com" }],
  creator: "Ajmal Gholzad",
  publisher: "Gholzad Management Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/images/logo/gholzad-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/images/logo/gholzad-logo.svg",
    apple: "/images/logo/gholzad-logo.svg",
  },
  openGraph: {
    title: "Ajmal Gholzad — Innovative Entrepreneur & Technology Founder",
    description:
      "An innovative entrepreneur, turning challenges into impactful solutions across global markets.",
    url: "https://ajmalgholzad.com",
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
    canonical: "https://ajmalgholzad.com",
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
    url: "https://ajmalgholzad.com",
    image: "https://ajmalgholzad.com/images/about/about.JPG",
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
        <link rel="icon" href="/images/logo/gholzad-logo.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
