import type { Metadata } from "next";
import ArticlesNewClient from "@/components/admin/articles/ArticlesNewClient";

export const metadata: Metadata = {
  title: "Criar artigo - Admin - dados.gov",
  description: "Criação de um novo artigo no portal dados.gov.",
};

export default function ArticlesNewPage() {
  return <ArticlesNewClient />;
}
