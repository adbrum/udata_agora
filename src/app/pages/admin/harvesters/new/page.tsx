import type { Metadata } from "next";
import HarvestersNewClient from "@/components/admin/harvesters/HarvestersNewClient";

export const metadata: Metadata = {
  title: "Criar harvester - Admin - dados.gov",
  description: "Criação de um novo harvester no portal dados.gov.",
};

export default function HarvestersNewPage() {
  return <HarvestersNewClient />;
}
