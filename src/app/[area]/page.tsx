import Link from "next/link";
import { notFound } from "next/navigation";
import { AssessmentFlow } from "@/components/AssessmentFlow";
import { Header } from "@/components/Header";
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
    <div className="relative min-h-full overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.22),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.15),transparent_40%)]"
      />

      <Header linkHome />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6 pb-24">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-accent-light transition hover:text-accent"
        >
          ← Back to home
        </Link>

        <section className="mt-8 max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-accent-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-light">
            {area.label}
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {area.label} assessment
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">{area.description}</p>
        </section>

        <AssessmentFlow areaId={areaId} areaLabel={area.label} />
      </main>
    </div>
  );
}
