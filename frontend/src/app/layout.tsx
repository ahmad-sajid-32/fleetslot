import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/styles.css";
const interfaceFont = localFont({
  src: "../../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2",
  weight: "100 1000",
  display: "swap",
  variable: "--font-dm-sans",
});
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
    <html lang="en" className={interfaceFont.variable}>
      <body className="bg-background font-interface text-sm leading-normal text-text-primary">
        {children}
      </body>
    </html>
  );
}
