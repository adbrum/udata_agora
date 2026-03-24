import type { Metadata } from "next";
import OrgDiscussionsClient from "@/components/admin/discussions/OrgDiscussionsClient";

export const metadata: Metadata = {
  title: "Discussões - Organização - Admin - dados.gov",
  description: "Gestão de discussões da organização no portal dados.gov.",
};

export default async function OrgDiscussionsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <OrgDiscussionsClient orgId={orgId} />;
}
