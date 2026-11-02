import type { Metadata } from "next";
import { CheckIn } from "@/components/CheckIn";

export const metadata: Metadata = {
  title: "Check-in",
  description: "Record a short voice check-in and see a private tone for how you sounded.",
};

export default function CheckInPage() {
  return (
    <main className="cd-main">
      <CheckIn />
    </main>
  );
}
