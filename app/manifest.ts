import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ReactFood",
    short_name: "ReactFood",
    description: "Considered food for nights that deserve better.",
    start_url: "/",
    display: "standalone",
    background_color: "#201d17",
    theme_color: "#ffc404",
    icons: [{ src: "/logo.jpg", sizes: "any", type: "image/jpeg" }],
  };
}
