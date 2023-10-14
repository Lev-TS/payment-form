export const i18n = {
  defaultLocale: "en",
  locales: ["en", "lt"] as const,
  supportedNumberFormats: [
    { separator: " ", decimal: "," }, // lt format
    { separator: ",", decimal: "." }, // en-US format
  ],
  supportedLang: {
    en: "English",
    lt: "Lithuanian",
  },
};

export type Locale = (typeof i18n)["locales"][number];
