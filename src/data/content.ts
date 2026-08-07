export type MediaAsset = { src: string; alt: string; replacement: string };
export type ProductFeature = { title: string; description: string };
export type Product = {
  name: string;
  category: string;
  tagline: string;
  description: string;
  details: string[];
  features?: ProductFeature[];
  url: string;
  video: { webm: string; mov: string };
  youtubeId?: string;
};
export type Venture = { category: string; title: string; period: string; description: string; image: MediaAsset };
export type TimelineMilestone = { year: string; title: string; description: string };
export type Partner = { name: string; logo: string };
export type GlobalRoute = { from: [number, number]; to: [number, number]; label: string };
export type GlobalLocation = { name: string; coordinates: [number, number]; labelOffset?: [number, number]; showLabel?: boolean };
export type CurrentVenture = { name: string; url: string; logo: string; descriptor: string };

export const site = {
  name: "Ajmal Gholzad",
  role: "Entrepreneur & Technology Founder",
  email: "ajmal@gholzad.com",
  whatsapp: {
    phone: "3165769444",
    message: "Hello, I am interested to have business with you",
  },
  location: "Global · Dubai", // Replace with confirmed business location.
  linkedin: "https://www.linkedin.com/", // Replace with Ajmal's profile.
  availability: "Open to select global partnerships",
};

export const nav = [
  ["Home", "home"], ["About", "about"], ["Global Network", "network"],
  ["Products", "products"], ["Contact", "contact"],
] as const;

export const media = {
  hero: { src: "/images/banner/gholzad-banner.png", alt: "Gholzad Banner", replacement: "Custom Gholzad Banner Image." },
  portrait: { src: "/images/about/about.JPG", alt: "Ajmal Gholzad", replacement: "Ajmal Gholzad Portrait Image." },
  manifesto: { src: "https://images.unsplash.com/photo-1517976547714-720226b864c1?auto=format&fit=crop&w=2200&q=80", alt: "Earth viewed from space", replacement: "Replace with subtle global-network background, 2200×1400." },
} satisfies Record<string, MediaAsset>;

export const currentVentures: CurrentVenture[] = [
  { name: "Coolmix", url: "https://coolmix.eu/", logo: "/images/logo/coolmix-logo.svg", descriptor: "Global mobile commerce" },
  { name: "Projectmix", url: "https://projectmix.ai/", logo: "/images/logo/projectmix-logo.svg", descriptor: "AI-powered technology" },
  { name: "gsmfeed", url: "https://gsmfeed.com/", logo: "/images/logo/gsmfeed-logo.svg", descriptor: "Mobile industry intelligence" },
];

export const timeline: TimelineMilestone[] = [
  { year: "2009", title: "Entrepreneurship begins", description: "A career begins with marketing, commercial instinct, and a willingness to learn every part of building a business." },
  { year: "2014", title: "Smartphone commerce", description: "Ajmal develops the idea of selling smartphone gear and gadgets online, opening a new chapter in digital commerce." },
  { year: "2015", title: "Premium mobile products", description: "The product range expands into smartphones from leading global brands, supported by a strong focus on trust and service." },
  { year: "2017", title: "Resilience under pressure", description: "After a major setback, more than 195 investors help fund the next stage—proof that trusted relationships can rebuild momentum." },
  { year: "2020", title: "A new chapter in Dubai", description: "Ajmal clears earlier business debts, responds quickly to changing demand, and begins a new international chapter in Dubai." },
  { year: "2022", title: "Operations meet technology", description: "New warehouse, quality-control, and technology capabilities turn years of commercial experience into a software vision." },
  { year: "Today", title: "Building what comes next", description: "Global product distribution, automation, and software now converge into scalable platforms and new partnerships." },
];

export const ventures: Venture[] = [
  { category: "Marketing", title: "Demand & Brand Building", period: "2009 — Present", description: "Strategy, positioning, acquisition, and market-shaping campaigns.", image: { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=82", alt: "Team in a strategy session", replacement: "Replace with a relevant agency or strategy image." } },
  { category: "Distribution", title: "Mobile Products Across Borders", period: "International", description: "Apple iPhone distribution built through trusted supply relationships and disciplined cross-market execution.", image: { src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=82", alt: "Premium smartphones representing international mobile product distribution", replacement: "Replace with Ajmal's verified mobile-phone inventory, distribution, or logistics photography." } },
  { category: "Commerce", title: "Digital Growth Engines", period: "Multi-market", description: "E-commerce and affiliate ventures built around measurable growth.", image: { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=82", alt: "Digital commerce on a laptop", replacement: "Replace with product or commerce imagery." } },
  { category: "Technology", title: "Software With Leverage", period: "Now", description: "Useful platforms that make complex business workflows feel simple.", image: { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=82", alt: "Technology circuitry", replacement: "Replace with current software-company imagery." } },
];

export const products: Product[] = [
  {
    name: "gsmfeed",
    category: "Global Electronics Marketplace",
    tagline: "Simplifying Global Electronic Trading with AI",
    description: "An AI-powered platform connecting verified traders, distributors, and retailers across the global consumer electronics market.",
    details: [
      "With access to over 170 leading brands and 150,000 verified leads from 145+ countries, gsmfeed ensures reliable connections and a steady supply of the latest devices, spare parts, and accessories—so you’ll never run out of stock.",
      "At gsmfeed, we make global trading simple, fast, and efficient, with user-friendly solutions and innovative tools to help grow your business.",
    ],
    features: [
      { title: "Pricing Manager", description: "For smarter pricing strategies" },
      { title: "Advanced Search", description: "Quickly find products or contacts with precision" },
      { title: "AI-Powered Broadcasts", description: "For the latest WTS and WTB offers or requests" },
      { title: "Trade Alerts", description: "Automated notifications through WhatsApp" },
    ],
    url: "https://gsmfeed.com/",
    video: { webm: "/images/content/gsmfeed.WEBM", mov: "/images/content/gsmfeed.mov" },
    youtubeId: "3nHuIYHbQxk",
  },
  {
    name: "Projectmix",
    category: "Trading ERP & Automation",
    tagline: "Revolutionizing Your Trading Business with Smart Automation",
    description: "The world’s first advanced ERP solution designed to streamline trading operations effortlessly.",
    details: [
      "Experience the world’s first advanced ERP solution designed to streamline your trading operations effortlessly. Our advanced, user-friendly software requires no manual, making automation simpler than ever.",
      "At Projectmix, we integrate all-in-one solutions such as KYC-approved customer management, order processing, testing, quality control, returns and repairs management, and seamless shipping workflows—all in one platform.",
      "Supercharge your trading business with automation, machine learning, and autopilot capabilities, all seamlessly embedded in our powerful Projectmix software.",
    ],
    url: "https://projectmix.ai/",
    video: { webm: "/images/content/projectmix.WEBM", mov: "/images/content/projectmix.mov" },
    youtubeId: "BXFt-ehckd0",
  },
  {
    name: "Coolmix",
    category: "Apple Device Distribution",
    tagline: "Your Trusted Partner for Used Apple Devices",
    description: "A leading distributor providing consistent access to a substantial inventory of used Apple devices.",
    details: [
      "With over a decade of experience, Coolmix® stands as a leading distributor of used Apple devices. We provide access to a massive inventory, ensuring a consistent supply of the latest iPhones, iPads, and MacBooks.",
      "Recognized as one of the most trusted European distributors, Coolmix® proudly participates in key exhibitions and events across multiple countries, showcasing our commitment to quality and reliability.",
    ],
    url: "https://coolmix.eu/",
    video: { webm: "/images/content/coolmix.WEBM", mov: "/images/content/Coolmix.mov" },
    youtubeId: "ruvEDGUYbY8",
  },
];

export const partners: Partner[] = [
  { name: "DHL", logo: "/images/partners/dhl-logo.png" },
  { name: "Ebury", logo: "/images/partners/ebury-logo.png" },
  { name: "Blackbelt 360", logo: "/images/partners/blackbelt-logo.png" },
  { name: "PCS Wireless", logo: "/images/partners/pcswireless-logo.png" },
  { name: "Sunstrike", logo: "/images/partners/sunstrike-logo.png" },
  { name: "Equals Money", logo: "/images/partners/equals-money-logo.png" },
];

export const globalLocations: GlobalLocation[] = [
  { name: "Europe", coordinates: [50.11, 8.68], showLabel: false },
  { name: "Belgium", coordinates: [50.85, 4.35], labelOffset: [-10, -20] },
  { name: "Poland", coordinates: [52.23, 21.01], labelOffset: [0, -24] },
  { name: "Italy", coordinates: [41.9, 12.5], labelOffset: [6, 16] },
  { name: "Spain", coordinates: [40.42, -3.7], labelOffset: [-8, 14] },
  { name: "Ukraine", coordinates: [50.45, 30.52], labelOffset: [10, -20] },
  { name: "Middle East", coordinates: [25.2, 55.27], labelOffset: [12, -16] },
  { name: "Hong Kong", coordinates: [22.32, 114.17], labelOffset: [12, -16] },
];

export const routes: GlobalRoute[] = [
  { from: [50.11, 8.68], to: [50.85, 4.35], label: "Europe — Belgium" },
  { from: [50.85, 4.35], to: [52.23, 21.01], label: "Belgium — Poland" },
  { from: [52.23, 21.01], to: [50.45, 30.52], label: "Poland — Ukraine" },
  { from: [50.85, 4.35], to: [40.42, -3.7], label: "Belgium — Spain" },
  { from: [40.42, -3.7], to: [41.9, 12.5], label: "Spain — Italy" },
  { from: [41.9, 12.5], to: [25.2, 55.27], label: "Italy — Middle East" },
  { from: [25.2, 55.27], to: [22.32, 114.17], label: "Middle East — Hong Kong" },
  { from: [50.11, 8.68], to: [22.32, 114.17], label: "Europe — Hong Kong" },
];
