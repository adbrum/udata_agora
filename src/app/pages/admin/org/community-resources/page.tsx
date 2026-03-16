import type { Metadata } from "next";
import OrgCommunityResourcesClient from "@/components/admin/community-resources/OrgCommunityResourcesClient";

export const metadata: Metadata = {
  title: "Recursos comunitários - Organização - Admin - dados.gov",
  description:
    "Gestão de recursos comunitários da organização no portal dados.gov.",
};

export default function OrgCommunityResourcesPage() {
  return <OrgCommunityResourcesClient />;
}
