import { z } from "zod";

import type { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/server.utils";

import { getPaymentFormSchema } from "./schema";

type Dict = Awaited<ReturnType<typeof getDictionary>>["pages"]["home"];

export interface PayerAccount {
  id: string;
  iban: string;
  balance: number;
}

export type PayerAccounts = PayerAccount[];

export interface PaymentFormProps {
  payerAccountsWithPositiveBalance: PayerAccounts;
  defaultPayerAccount: PayerAccount;
  dict: Dict;
}

export interface GetPaymentFormSchemaFnArgs {
  lang: Locale;
  payerAccountsWithPositiveBalance: PayerAccounts;
  dict: Dict;
}

export type PaymentFormSchemaType = ReturnType<typeof getPaymentFormSchema>;
export type PaymentFormDataType = z.infer<PaymentFormSchemaType>;
