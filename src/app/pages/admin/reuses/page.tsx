import type { Metadata } from "next";
import ReusesClient from "@/components/admin/reuses/ReusesClient";

export const metadata: Metadata = {
  title: "Reutilizações - Admin - dados.gov",
  description: "Gestão de reutilizações no portal dados.gov.",
};

export default function ReusesPage() {
  return <ReusesClient />;
}
