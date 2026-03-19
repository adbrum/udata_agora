export function formatNumberExtense(
  number: number | string | undefined,
  locale: string = "pt",
): {
  numberResolve?: string;
  extense: string;
  full?: string;
} {
  const normalizedLocale = {
    pt: "pt-PT",
    en: "en-GB",
  };

  const keyLocale = locale as keyof typeof normalizedLocale;

  const num =
    typeof number === "string"
      ? parseFloat(number.replace(/\s/g, ""))
      : Number(number);

  if (isNaN(num)) throw new Error("Valor inválido");

  // Caso especial para 0
  if (num === 0) {
    return {
      extense: "0",
      full: "0",
    };
  }

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const compactFormatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "long",
    maximumFractionDigits: 2,
  });

  const formatted = compactFormatter.format(num);

  if (absNum < 1000) {
    return {
      extense: new Intl.NumberFormat(normalizedLocale[keyLocale], {
        maximumFractionDigits: 2,
      }).format(num),
    };
  }

  const parts = new Intl.NumberFormat(normalizedLocale[keyLocale], {
    notation: "compact",
    compactDisplay: "long",
    maximumFractionDigits: 2,
  }).formatToParts(absNum);

  let numberPart = "";
  let literalPart = "";

  parts.forEach((part) => {
    if (
      part.type === "integer" ||
      part.type === "decimal" ||
      part.type === "fraction"
    ) {
      numberPart += part.value;
    } else if (part.type === "compact") {
      literalPart = part.value.trim();
    }
  });

  const signPrefix = isNegative ? "-" : "";

  return {
    numberResolve: numberPart ? `${signPrefix}${numberPart}` : formatted,
    extense: literalPart || formatted,
    full:
      numberPart && literalPart
        ? `${signPrefix}${numberPart} ${literalPart}`
        : formatted,
  };
}