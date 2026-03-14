import type { Metadata } from "next";
import StatisticsClient from "@/components/admin/statistics/StatisticsClient";

export const metadata: Metadata = {
  title: "Estatísticas - Admin - dados.gov",
  description: "Estatísticas do utilizador no portal dados.gov.",
};

export default function StatisticsPage() {
  return <StatisticsClient />;
}
