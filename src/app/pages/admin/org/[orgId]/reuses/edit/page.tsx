import type { Metadata } from "next";
import ReusesEditClient from "@/components/admin/reuses/ReusesEditClient";

export const metadata: Metadata = {
  title: "Editar reutilização - Organização - Admin - dados.gov",
  description: "Editar reutilização da organização no portal dados.gov.",
};

export default function OrgReusesEditPage() {
  return <ReusesEditClient />;
}
