import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Blue Ox Group",
    short_name: "Blue Ox",
    description:
      "Blue Ox Group — a group of software companies. Directory of sales and marketing representatives.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  }
}
