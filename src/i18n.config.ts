export const i18n = {
  defaultLocale: "en",
  locales: ["en", "lt"] as const,
  supportedNumberFormats: [
    { separator: ".", decimal: "," }, // eu format
    { separator: " ", decimal: "," }, // lt format
    { separator: ",", decimal: "." }, // en-US format
  ] as const,
};

export type Locale = (typeof i18n)["locales"][number];
