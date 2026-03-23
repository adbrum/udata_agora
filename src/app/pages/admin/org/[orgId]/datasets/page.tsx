import type { Metadata } from "next";
import OrgDatasetsClient from "@/components/admin/datasets/OrgDatasetsClient";

export const metadata: Metadata = {
  title: "Conjunto de dados - Organização - Admin - dados.gov",
  description: "Gestão de conjuntos de dados da organização no portal dados.gov.",
};

export default function OrgDatasetsPage() {
  return <OrgDatasetsClient />;
}
