"use client";

import { Suspense } from "react";
import MigrateAccountClient from "@/components/login/MigrateAccountClient";

export default function MigrateAccountPage() {
  return (
    <Suspense fallback={<div>A carregar...</div>}>
      <MigrateAccountClient />
    </Suspense>
  );
}
