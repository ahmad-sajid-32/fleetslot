import type { Metadata } from "next";
import "@/styles/styles.css";
export const metadata: Metadata = {
  title: "FleetSlot · Fleet Operations",
  description:
    "Coordinate vehicle handoffs, cleaning, inspections, and maintenance.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background font-sans text-sm leading-normal text-text-primary">
        {children}
      </body>
    </html>
  );
}
