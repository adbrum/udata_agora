"use client";

import React, { type ReactElement } from "react";
import {
  InputSelect,
  type DropdownSectionProps,
} from "@ama-pt/agora-design-system";

/**
 * Isolated InputSelect wrapper to prevent re-render cascades.
 *
 * The Agora Design System InputSelect calls setState during the render cycle
 * of other components (React 19 incompatibility), causing sibling selects to
 * lose their selection when any form field triggers a re-render.
 *
 * This component wraps InputSelect in React.memo so it only re-renders when
 * its own props change. Values are stored via a MutableRefObject to avoid
 * triggering parent re-renders on selection.
 */

interface IsolatedSelectProps {
  label: string;
  placeholder: string;
  id: string;
  onChangeRef: React.MutableRefObject<string>;
  type?: "checkbox" | "text";
  hasError?: boolean;
  errorFeedbackText?: string;
  hideLabel?: boolean;
  searchable?: boolean;
  searchInputPlaceholder?: string;
  searchNoResultsText?: string;
  onChangeCallback?: (value: string) => void;
  children:
    | ReactElement<DropdownSectionProps>
    | ReactElement<DropdownSectionProps>[];
}

const IsolatedSelect = React.memo(function IsolatedSelect({
  label,
  placeholder,
  id,
  onChangeRef,
  type,
  hasError,
  errorFeedbackText,
  hideLabel,
  searchable,
  searchInputPlaceholder,
  searchNoResultsText,
  onChangeCallback,
  children,
}: IsolatedSelectProps) {
  return (
    <InputSelect
      label={label}
      placeholder={placeholder}
      id={id}
      type={type}
      hideLabel={hideLabel}
      searchable={searchable}
      searchInputPlaceholder={searchInputPlaceholder}
      searchNoResultsText={searchNoResultsText}
      onChange={(options) => {
        const value = options.map((o) => o.value as string).join(",");
        onChangeRef.current = value;
        onChangeCallback?.(value);
      }}
      hasError={hasError}
      hasFeedback={hasError}
      feedbackState="danger"
      errorFeedbackText={errorFeedbackText}
    >
      {children}
    </InputSelect>
  );
});

export default IsolatedSelect;
