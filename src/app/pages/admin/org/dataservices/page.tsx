import type { Metadata } from "next";
import OrgDataservicesClient from "@/components/admin/dataservices/OrgDataservicesClient";

export const metadata: Metadata = {
  title: "API - Organização - Admin - dados.gov",
  description: "Gestão de APIs da organização no portal dados.gov.",
};

export default function OrgDataservicesPage() {
  return <OrgDataservicesClient />;
}
