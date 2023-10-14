import { Locale } from "@/i18n.config";

import { ValidateIbanApiResponse } from "./client.utils.types";

export const validateIban = async (iban: string, lang: Locale): Promise<ValidateIbanApiResponse> => {
  // I'm making this request through server because the browser request is blocked by
  // CORS policy at https://matavi.eu/
  const url = `${window.location.origin}/${lang}/api/${iban}`;
  const res = await fetch(new Request(url));

  return await res.json();
};
