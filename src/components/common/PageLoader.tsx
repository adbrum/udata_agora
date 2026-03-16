"use client";

import { useEffect, useState } from "react";
import { LoaderDialog } from "@ama-pt/agora-design-system";

export default function PageLoader({ delay = 800 }: { delay?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="flex justify-center items-center py-64">
      <LoaderDialog title="A carregar..." />
    </div>
  );
}
