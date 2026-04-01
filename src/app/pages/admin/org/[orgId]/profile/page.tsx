import type { Metadata } from "next";
import OrgProfileClient from "@/components/admin/profile/OrgProfileClient";

export const metadata: Metadata = {
  title: "Perfil - Organização - Admin - dados.gov",
  description: "Edição do perfil da organização no portal dados.gov.",
};

export default function OrgProfilePage() {
  return <OrgProfileClient />;
}
