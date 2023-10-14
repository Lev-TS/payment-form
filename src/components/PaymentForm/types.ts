import { z } from "zod";

import type { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/server.utils";

import { getPaymentFormSchema } from "./schema";

export type HomePageDict = Awaited<ReturnType<typeof getDictionary>>["pages"]["home"];

export interface PayerAccount {
  id: string;
  iban: string;
  balance: number;
}

export type PayerAccounts = PayerAccount[];

export interface PaymentFormProps {
  payerAccountsWithPositiveBalance: PayerAccounts;
  defaultPayerAccount: PayerAccount;
  dict: HomePageDict;
}

export interface GetPaymentFormSchemaFnArgs {
  payerAccountsWithPositiveBalance: PayerAccounts;
  dict: HomePageDict;
}

export type PaymentFormSchemaType = ReturnType<typeof getPaymentFormSchema>;
export type PaymentFormDataType = z.infer<PaymentFormSchemaType>;
