import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka, Source_Serif_4 } from "next/font/google";
import { AuthGate } from "@/components/AuthGate";
import { AuthProvider } from "@/components/AuthProvider";
import { HeartRateProvider } from "@/components/HeartRateProvider";
import { MyoWareProvider } from "@/components/MyoWareProvider";
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

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const kidsDisplay = Fredoka({
  variable: "--font-kids",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Revive Motion | Physical Therapy Assistance",
  description:
    "Home physical therapy assistance for patients, clinicians, and caregivers. Measure with Photo Goniometer, MyoWare 2.0, or a heart sensor; follow today’s dose; keep your care team in the loop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${kidsDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <HeartRateProvider>
            <MyoWareProvider>
              <AuthGate>
                {children}
                <NotificationScheduler />
                <ChatAssistant />
              </AuthGate>
            </MyoWareProvider>
          </HeartRateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
