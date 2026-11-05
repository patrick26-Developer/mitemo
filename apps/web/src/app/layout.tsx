import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mitemo",
  description: "L'épargne solidaire connectée.",
};

/**
 * Gabarit racine de toutes les pages.
 * @param props Propriétés du gabarit.
 * @param props.children Page rendue à l'intérieur du gabarit.
 * @returns Le document HTML en français.
 */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
