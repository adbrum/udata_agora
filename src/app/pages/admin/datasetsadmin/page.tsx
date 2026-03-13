import type { Metadata } from "next";
import DatasetsAdminClient from "@/components/admin/datasetsadmin/DatasetsAdminClient";

export const metadata: Metadata = {
  title: "Formulário de inscrição - Admin - dados.gov",
  description: "Formulário de inscrição para novos conjuntos de dados no portal dados.gov.",
};

export default function DatasetsAdminPage() {
  return <DatasetsAdminClient />;
}
