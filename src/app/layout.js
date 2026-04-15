import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "TaskManager",
    template: "%s | TaskManager",
  },
  description:
    "Application de gestion de tâches pour organiser votre quotidien efficacement.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <head />
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <Navigation />
          <main className="flex flex-1 flex-col pb-16 sm:pb-0">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
