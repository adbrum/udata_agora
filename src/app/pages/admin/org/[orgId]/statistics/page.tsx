import type { Metadata } from "next";
import OrgStatisticsClient from "@/components/admin/statistics/OrgStatisticsClient";

export const metadata: Metadata = {
  title: "Estatísticas - Organização - Admin - dados.gov.pt",
  description: "Estatísticas da organização no portal dados.gov.pt.",
};

export default function OrgStatisticsPage() {
  return <OrgStatisticsClient />;
}
