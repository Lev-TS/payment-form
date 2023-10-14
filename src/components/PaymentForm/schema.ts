import { z } from "zod";

import { GetPaymentFormSchemaFnArgs } from "./types";

export const getPaymentFormSchema = ({ lang, payerAccounts, dict }: GetPaymentFormSchemaFnArgs) =>
  z
    .object({
      payeeAccount: z.string().min(1, "Required"),
      amount: z
        .string()
        .transform((val, ctx) => {
          const parsed = parseFloat(val);

          if (isNaN(parsed)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Should be a number",
            });

            return z.NEVER;
          }

          if (parsed < 0.01) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Min 1 cent",
            });

            return z.NEVER;
          }

          return parsed;

          return parsed.toLocaleString(lang, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        })
        .or(z.number().min(0.01, "Min 1 cent")),
      purpose: z
        .string()
        .max(135, { message: "Max 135 letters" })
        .transform((val, ctx) => {
          if (val.length < 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Required",
            });

            return z.NEVER;
          }

          if (val.length < 3) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Min 3 letters",
            });

            return z.NEVER;
          }

          return val;
        }),
      payerAccount: z.string().min(1, "Required"),
      payee: z.string().min(1, "Required").max(70, "Max 70 letters"),
    })
    .refine(
      (schema) => {
        const selectedAccount = payerAccounts.find((account) => account.iban === schema.payerAccount);

        return selectedAccount && selectedAccount.balance >= Number(schema.amount);
      },
      { message: "Insufficient funds on your account", path: ["amount"] },
    );
