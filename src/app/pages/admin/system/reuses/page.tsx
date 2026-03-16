import type { Metadata } from "next";
import SystemReusesClient from "@/components/admin/reuses/SystemReusesClient";

export const metadata: Metadata = {
  title: "Reutilizações - Sistema - Admin - dados.gov",
  description: "Gestão de reutilizações do sistema no portal dados.gov.",
};

export default function SystemReusesPage() {
  return <SystemReusesClient />;
}
