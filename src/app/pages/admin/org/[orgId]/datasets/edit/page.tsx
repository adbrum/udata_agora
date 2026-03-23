import type { Metadata } from "next";
import DatasetsEditClient from "@/components/admin/datasets/DatasetsEditClient";

export const metadata: Metadata = {
  title: "Editar conjunto de dados - Organização - Admin - dados.gov",
  description: "Editar conjunto de dados da organização no portal dados.gov.",
};

export default function OrgDatasetsEditPage() {
  return <DatasetsEditClient />;
}
