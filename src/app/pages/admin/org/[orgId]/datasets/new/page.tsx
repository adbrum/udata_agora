import type { Metadata } from "next";
import OrgDatasetsNewClient from "@/components/admin/datasets/OrgDatasetsNewClient";

export const metadata: Metadata = {
  title: "Publique em dados.gov - Organização - Admin - dados.gov",
  description: "Escolha como publicar os dados da organização no portal dados.gov.",
};

export default function OrgDatasetsNewPage() {
  return <OrgDatasetsNewClient />;
}
