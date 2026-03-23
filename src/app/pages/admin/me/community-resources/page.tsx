import type { Metadata } from "next";
import CommunityResourcesClient from "@/components/admin/community-resources/CommunityResourcesClient";

export const metadata: Metadata = {
  title: "Recursos comunitários - Admin - dados.gov",
  description: "Gestão de recursos comunitários no portal dados.gov.",
};

export default function CommunityResourcesPage() {
  return <CommunityResourcesClient />;
}
