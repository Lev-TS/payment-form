import { z } from "zod";

import { parseLocalizedNumber } from "@/lib/utils";

import { GetPaymentFormSchemaFnArgs } from "./types";

export const getPaymentFormSchema = ({ lang, payerAccountsWithPositiveBalance, dict }: GetPaymentFormSchemaFnArgs) =>
  z
    .object({
      payeeAccount: z
        .string()
        .min(1, "This field is required")
        .transform((userInput, context) => {
          const trimmedInput = userInput.trim();

          if (userInput.length < 15 || userInput.length > 34) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Please enter valid IBAN",
            });

            return z.NEVER;
          }

          return trimmedInput;
        }),
      amount: z
        .string()
        .transform((userInput, context) => {
          const parsedInput = parseLocalizedNumber(userInput);

          if (isNaN(parsedInput)) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Please enter valid number",
            });

            return z.NEVER;
          }

          if (parsedInput < 0.01) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Minimum payment is: " + (0.01).toLocaleString(lang),
            });

            return z.NEVER;
          }

          return parsedInput;
        })
        .or(z.number().min(0.01, "Minimum payment is: " + (0.01).toLocaleString(lang))),
      purpose: z
        .string()
        .max(135, { message: "Please shorten (max 135 symbols)" })
        .transform((userInput, context) => {
          if (userInput.length < 1) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: "This field is required",
            });

            return z.NEVER;
          }

          if (userInput.length < 3) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Please provide valid description",
            });

            return z.NEVER;
          }

          return userInput;
        }),
      payerAccount: z.string().min(1, "This field is required"),
      payee: z.string().min(1, "This field is required").max(70, "Please shorten (max 70 symbols)"),
    })
    .refine(
      (schema) => {
        const selectedAccount = payerAccountsWithPositiveBalance.find(
          (account) => account.iban === schema.payerAccount,
        );
        return selectedAccount && selectedAccount.balance >= Number(schema.amount);
      },
      { message: "Not enough money on your account", path: ["amount"] },
    );
