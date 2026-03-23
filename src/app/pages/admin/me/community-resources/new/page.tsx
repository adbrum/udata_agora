import type { Metadata } from "next";
import CommunityResourceNewClient from "@/components/admin/community-resources/CommunityResourceNewClient";

export const metadata: Metadata = {
  title: "Novo recurso comunitário - Admin - dados.gov",
  description:
    "Formulário para publicar um novo recurso comunitário no portal dados.gov.",
};

export default function CommunityResourceNewPage() {
  return <CommunityResourceNewClient />;
}
