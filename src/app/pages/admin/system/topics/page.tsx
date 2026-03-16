import type { Metadata } from "next";
import SystemTopicsClient from "@/components/admin/topics/SystemTopicsClient";

export const metadata: Metadata = {
  title: "Temas - Sistema - Admin - dados.gov",
  description: "Gestão de temas do sistema no portal dados.gov.",
};

export default function SystemTopicsPage() {
  return <SystemTopicsClient />;
}
