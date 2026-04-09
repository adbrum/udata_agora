import type { Metadata } from "next";
import HarvesterDetailClient from "@/components/admin/harvesters/HarvesterDetailClient";

export const metadata: Metadata = {
  title: "Detalhe do harvester - Admin - dados.gov.pt",
  description: "Detalhe de um harvester no portal dados.gov.pt.",
};

export default async function HarvesterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <HarvesterDetailClient slug={slug} />;
}
