import Link from "next/link";
import { notFound } from "next/navigation";
import { AssessmentFlow } from "@/components/AssessmentFlow";
import { Header } from "@/components/Header";
import { DashHero } from "@/components/clinic/DashKit";
import { bodyAreas, getBodyArea } from "@/lib/body-areas";

type AreaPageProps = {
  params: Promise<{ area: string }>;
};

export function generateStaticParams() {
  return bodyAreas.map((area) => ({ area: area.id }));
}

export async function generateMetadata({ params }: AreaPageProps) {
  const { area: areaId } = await params;
  const area = getBodyArea(areaId);

  if (!area) {
    return { title: "Not Found | Revive Motion" };
  }

  return {
    title: `${area.label} Assessment | Revive Motion`,
    description: area.description,
  };
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { area: areaId } = await params;
  const area = getBodyArea(areaId);

  if (!area) {
    notFound();
  }

  return (
    <div className="relative min-h-full overflow-hidden rm-glow-patient pb-16 text-foreground">
      <Header linkHome />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-4 pb-24 sm:px-6">
        <Link href="/" className="mt-4 inline-flex w-fit text-sm font-semibold text-[#1b3348] transition hover:opacity-80">
          ← Back to home
        </Link>

        <div className="mt-5">
          <DashHero src={area.cover} kicker="Assessment" title={`${area.label} assessment`} text={area.description} />
        </div>

        <AssessmentFlow areaId={areaId} areaLabel={area.label} />
      </main>
    </div>
  );
}
