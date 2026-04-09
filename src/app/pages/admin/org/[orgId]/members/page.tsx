import type { Metadata } from "next";
import MembersClient from "@/components/admin/members/MembersClient";

export const metadata: Metadata = {
  title: "Membros - Admin - dados.gov.pt",
  description: "Gestão de membros da organização no portal dados.gov.pt.",
};

export default function MembersPage() {
  return <MembersClient />;
}
