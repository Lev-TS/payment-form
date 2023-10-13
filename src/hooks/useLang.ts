import { type Locale } from "@/i18n.config";
import { usePathname } from "next/navigation";

export const useLang = () => {
  const pathName = usePathname();
  const lang = pathName.split("/")[1] ?? "en";

  return lang as Locale;
};
