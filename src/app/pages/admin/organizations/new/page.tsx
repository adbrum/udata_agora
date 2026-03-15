import type { Metadata } from "next";
import OrganizationsNewClient from "@/components/admin/organizations/OrganizationsNewClient";

export const metadata: Metadata = {
  title: "Criar organização - Admin - dados.gov",
  description: "Criação de uma nova organização no portal dados.gov.",
};

export default function OrganizationsNewPage() {
  return <OrganizationsNewClient />;
}
