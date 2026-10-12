import type { Metadata } from "next";
import type { ReactNode } from "react";
import { esAR } from "@/messages/es-AR";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${esAR.site.name} | ${esAR.site.tagline}`,
    template: `%s | ${esAR.site.name}`,
  },
  description: esAR.site.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
