import type { Metadata } from "next";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/branding";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthGate } from "@/components/AuthGate";
import { AuthProvider } from "@/components/AuthProvider";
import { SensorProvider } from "@/components/SensorProvider";
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

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: BRAND_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <SensorProvider>
            <AuthGate>
              {children}
              <NotificationScheduler />
              <ChatAssistant />
            </AuthGate>
          </SensorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
