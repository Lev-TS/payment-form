import { z } from "zod";

import type { Locale } from "@/i18n.config";
import type { PayerAccounts } from "@/lib/api.types";
import { getDictionary } from "@/lib/dictionary.utils";

import { getPaymentFormSchema } from "./schema";

type Dict = Awaited<ReturnType<typeof getDictionary>>["pages"]["home"];

export interface PaymentFormProps {
  payerAccounts: PayerAccounts;
  dict: Dict;
}

export interface GetPaymentFormSchemaFnArgs {
  lang: Locale;
  payerAccounts: PayerAccounts;
  dict: Dict;
}

export type PaymentFormSchemaType = ReturnType<typeof getPaymentFormSchema>;
export type PaymentFormDataType = z.infer<PaymentFormSchemaType>;
