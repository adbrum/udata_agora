import type { Metadata } from "next";
import DatasetsNewClient from "@/components/admin/datasets/DatasetsNewClient";

export const metadata: Metadata = {
  title: "Publique em dados.gov - Admin - dados.gov",
  description: "Escolha como publicar os seus dados no portal dados.gov.",
};

export default function DatasetsNewPage() {
  return <DatasetsNewClient />;
}
