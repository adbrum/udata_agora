import type { Metadata } from "next";
import SystemArticlesClient from "@/components/admin/articles/SystemArticlesClient";

export const metadata: Metadata = {
  title: "Artigos - Sistema - Admin - dados.gov",
  description: "Gestão de artigos do sistema no portal dados.gov.",
};

export default function SystemArticlesPage() {
  return <SystemArticlesClient />;
}
