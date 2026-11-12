import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Alphaville · The research desk",
  description:
    "A local, synthetic prototype for research, structured ideas and historical client evidence.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to workspace
        </a>
        {children}
      </body>
    </html>
  );
}
