"use client";

import { PopupProvider } from "@ama-pt/agora-design-system";
import { ReactNode } from "react";

export function PopupProviderWrapper({ children }: { children: ReactNode }) {
  return <PopupProvider dismissOnBackdropClick dismissOnEscape>{children}</PopupProvider>;
}
