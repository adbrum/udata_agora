import type { Metadata } from "next";
import ReusesNewClient from "@/components/admin/reuses/ReusesNewClient";

export const metadata: Metadata = {
  title: "Descreva a sua reutilização - Admin - dados.gov",
  description:
    "Formulário de inscrição para novas reutilizações no portal dados.gov.",
};

export default function ReusesNewPage() {
  return <ReusesNewClient />;
}
