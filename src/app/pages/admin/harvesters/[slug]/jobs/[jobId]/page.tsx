import type { Metadata } from "next";
import HarvestJobDetailClient from "@/components/admin/harvesters/HarvestJobDetailClient";

export const metadata: Metadata = {
  title: "Detalhe do trabalho - Admin - dados.gov",
  description: "Detalhe de um trabalho de harvesting no portal dados.gov.",
};

export default async function HarvestJobDetailPage({
  params,
}: {
  params: Promise<{ slug: string; jobId: string }>;
}) {
  const { slug, jobId } = await params;
  return <HarvestJobDetailClient slug={slug} jobId={jobId} />;
}
