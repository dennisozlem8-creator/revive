import type { Metadata } from "next";
import { HistoryBoard } from "@/components/HistoryBoard";

export const metadata: Metadata = {
  title: "History",
  description: "Private Cadence check-ins saved in this browser.",
};

export default function HistoryPage() {
  return (
    <main className="cd-main">
      <p className="cd-kicker">On this device</p>
      <h1>Your check-ins</h1>
      <p className="cd-lead">Newest first. Example voices are tagged and do not move your personal baseline.</p>
      <HistoryBoard />
    </main>
  );
}
