import type { Metadata } from "next";
import DataservicesClient from "@/components/admin/dataservices/DataservicesClient";

export const metadata: Metadata = {
  title: "API - Admin - dados.gov",
  description: "Gestão de APIs no portal dados.gov.",
};

export default function DataservicesPage() {
  return <DataservicesClient />;
}
