import { usePathname } from "next/navigation";

import { type Locale } from "@/i18n.config";

export const useLang = () => {
  const pathName = usePathname();
  const lang = pathName.split("/")[1] ?? "en";

  return lang as Locale;
};
