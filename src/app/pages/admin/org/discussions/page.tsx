import type { Metadata } from "next";
import DiscussionsClient from "@/components/admin/discussions/DiscussionsClient";

export const metadata: Metadata = {
  title: "Discussões - Admin - dados.gov",
  description: "Gestão de discussões no portal dados.gov.",
};

export default function DiscussionsPage() {
  return <DiscussionsClient />;
}
