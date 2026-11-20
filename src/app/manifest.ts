import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GearNest — Equipment Rental Marketplace",
    short_name: "GearNest",
    description:
      "Rent construction, photography, vehicle, agriculture, electronics and event equipment from verified owners.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F3EC",
    theme_color: "#17493A",
    orientation: "portrait-primary",
    categories: ["business", "shopping", "productivity"],
    icons: [
      {
        src: "/gearnest-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
