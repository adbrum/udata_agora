import type { Metadata } from "next";
import OrgReusesClient from "@/components/admin/reuses/OrgReusesClient";

export const metadata: Metadata = {
  title: "Reutilizações - Organização - Admin - dados.gov",
  description: "Gestão de reutilizações da organização no portal dados.gov.",
};

export default function OrgReusesPage() {
  return <OrgReusesClient />;
}
