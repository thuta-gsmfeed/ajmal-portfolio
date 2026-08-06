export type MediaAsset = { src: string; alt: string; replacement: string };
export type Product = { name: string; category: string; description: string; year: string; technology: string[]; url: string; image: MediaAsset };
export type Venture = { category: string; title: string; period: string; description: string; image: MediaAsset };
export type TimelineMilestone = { year: string; title: string; description: string };
export type Partner = { name: string; monogram: string };
export type GlobalRoute = { from: [number, number]; to: [number, number]; label: string };

export const site = {
  name: "Ajmal Gholzad",
  role: "Entrepreneur & Technology Founder",
  email: "hello@ajmalgholzad.com", // Replace with Ajmal's confirmed email.
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
  { name: "Product 01", category: "Technology Platform", description: "A connected platform designed to make a high-value workflow faster, clearer, and more scalable.", year: "2026", technology: ["Next.js", "AI", "Cloud"], url: "#contact", image: { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=84", alt: "Placeholder analytics product interface", replacement: "Replace with Product 01 desktop screenshot, 16:10." } },
  { name: "Product 02", category: "Digital Commerce Product", description: "Commerce infrastructure shaped around customer experience, operational clarity, and growth.", year: "2025", technology: ["Commerce", "Data", "Automation"], url: "#contact", image: { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=84", alt: "Placeholder commerce dashboard", replacement: "Replace with Product 02 website screenshot, 16:10." } },
  { name: "Product 03", category: "Business Management Software", description: "A focused workspace that turns everyday business complexity into calm, decisive action.", year: "2025", technology: ["SaaS", "Operations", "Insights"], url: "#contact", image: { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=2000&q=84", alt: "Placeholder business software presentation", replacement: "Replace with Product 03 interface screenshot, 16:10." } },
  { name: "Product 04", category: "Global Services Platform", description: "A digital bridge between international opportunities, trusted partners, and execution.", year: "2026", technology: ["Global", "Marketplace", "Services"], url: "#contact", image: { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=84", alt: "Earth with digital connections", replacement: "Replace with Product 04 website screenshot, 16:10." } },
];

export const partners: Partner[] = ["NORTHSTAR", "ORBITAL", "VERTEX", "ATLAS", "NEXUS", "HORIZON", "PRIME", "UNION"].map((name) => ({ name, monogram: name.slice(0, 2) }));

export const routes: GlobalRoute[] = [
  { from: [25.2, 55.3], to: [51.5, -0.1], label: "Dubai — London" },
  { from: [25.2, 55.3], to: [1.35, 103.8], label: "Dubai — Singapore" },
  { from: [25.2, 55.3], to: [40.7, -74], label: "Dubai — New York" },
  { from: [51.5, -0.1], to: [37.8, -122.4], label: "London — San Francisco" },
  { from: [1.35, 103.8], to: [35.7, 139.7], label: "Singapore — Tokyo" },
];
