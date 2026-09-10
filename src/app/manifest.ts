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
    icons: [
      { src: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
