import type { Metadata } from "next";
import DatasetsClient from "@/components/admin/datasets/DatasetsClient";

export const metadata: Metadata = {
  title: "Conjunto de dados - Admin - dados.gov",
  description: "Gestão de conjuntos de dados no portal dados.gov.",
};

export default function DatasetsPage() {
  return <DatasetsClient />;
}
