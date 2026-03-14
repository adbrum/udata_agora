import type { Metadata } from "next";
import DatasetsNewClient from "@/components/admin/datasets/DatasetsNewClient";

export const metadata: Metadata = {
  title: "Publicar em dados.gov - Admin - dados.gov",
  description: "Escolha como publicar os seus dados no portal dados.gov.",
};

export default function DatasetsNewPage() {
  return <DatasetsNewClient />;
}
