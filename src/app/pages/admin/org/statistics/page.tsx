import type { Metadata } from "next";
import OrgStatisticsClient from "@/components/admin/statistics/OrgStatisticsClient";

export const metadata: Metadata = {
  title: "Estatísticas - Organização - Admin - dados.gov",
  description: "Estatísticas da organização no portal dados.gov.",
};

export default function OrgStatisticsPage() {
  return <OrgStatisticsClient />;
}
