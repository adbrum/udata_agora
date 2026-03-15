import type { Metadata } from "next";
import SystemEditorialClient from "@/components/admin/editorial/SystemEditorialClient";

export const metadata: Metadata = {
  title: "Editorial - Sistema - Admin - dados.gov",
  description: "Gestão editorial do sistema no portal dados.gov.",
};

export default function SystemEditorialPage() {
  return <SystemEditorialClient />;
}
