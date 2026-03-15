import type { Metadata } from "next";
import SystemOrganizationsClient from "@/components/admin/organizations/SystemOrganizationsClient";

export const metadata: Metadata = {
  title: "Organizações - Sistema - Admin - dados.gov",
  description: "Gestão de organizações do sistema no portal dados.gov.",
};

export default function SystemOrganizationsPage() {
  return <SystemOrganizationsClient />;
}
