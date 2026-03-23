import type { Metadata } from "next";
import MembersClient from "@/components/admin/members/MembersClient";

export const metadata: Metadata = {
  title: "Membros - Admin - dados.gov",
  description: "Gestão de membros da organização no portal dados.gov.",
};

export default function MembersPage() {
  return <MembersClient />;
}
