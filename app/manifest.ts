import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RandomTAD",
    short_name: "RandomTAD",
    description: "To boldy go where no Podcast has gone before.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#fbc112",
    icons: [
      {
        src: "/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
