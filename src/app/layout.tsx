import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import { AuthGate } from "@/components/AuthGate";
import { AuthProvider } from "@/components/AuthProvider";
import { HeartRateProvider } from "@/components/HeartRateProvider";
import { NotificationScheduler } from "@/components/NotificationScheduler";
import { ChatAssistant } from "@/components/ChatAssistant";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kidsDisplay = Fredoka({
  variable: "--font-kids",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Revive Motion",
  description: "Guided recovery and mobility exercises by body area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${kidsDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <HeartRateProvider>
            <AuthGate>
              {children}
              <NotificationScheduler />
              <ChatAssistant />
            </AuthGate>
          </HeartRateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
