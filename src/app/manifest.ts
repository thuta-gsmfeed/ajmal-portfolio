import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ajmal Gholzad — Portfolio",
    short_name: "Ajmal Gholzad",
    description: "Entrepreneur and technology founder building businesses, platforms, and global partnerships.",
    start_url: "/",
    display: "standalone",
    background_color: "#030506",
    theme_color: "#030506",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
