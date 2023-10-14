import { z } from "zod";

import { GetPaymentFormSchemaFnArgs } from "./types";

export const getPaymentFormSchema = ({ payerAccountsWithPositiveBalance, dict }: GetPaymentFormSchemaFnArgs) =>
  z
    .object({
      payeeAccount: z
        .string()
        .min(1, dict.requiredField)
        .transform((userInput, context) => {
          const trimmedInput = userInput.trim();

          // To save time, I'm taking a shortcut and validating iban on form submission. Technically,
          // it's a better user experience to validate it before. That could be achieved with
          // async validator and debounced input, or with more complex flow.
          if (userInput.length < 15 || userInput.length > 34) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: dict.invalidIban,
            });

            return z.NEVER;
          }

          return trimmedInput;
        }),
      amount: z
        .string()
        .min(1, dict.requiredField)
        .transform((userInput, context) => {
          // I'm taking another shortcut here, a production grade app should use more robust number parser.
          const parsedInput = Number(userInput.replace(" ", "").replace(",", "."));

          if (isNaN(parsedInput)) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: dict.invalidNumber,
            });

            return z.NEVER;
          }

          if (parsedInput < 0.01) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: dict.minPayment,
            });

            return z.NEVER;
          }

          return parsedInput;
        })
        .or(z.number().min(0.01, dict.minPayment)),
      purpose: z
        .string()
        .max(135, { message: dict.pleaseShorten.replace("%", "135") })
        .transform((userInput, context) => {
          if (userInput.length < 1) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: dict.requiredField,
            });

            return z.NEVER;
          }

          if (userInput.length < 3) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: dict.invalidDescription,
            });

            return z.NEVER;
          }

          return userInput;
        }),
      payerAccount: z.string().min(1, dict.requiredField),
      payee: z.string().min(1, dict.requiredField).max(70, dict.pleaseShorten.replace("%", "70")),
    })
    .refine(
      (schema) => {
        const selectedAccount = payerAccountsWithPositiveBalance.find(
          (account) => account.iban === schema.payerAccount,
        );
        return selectedAccount && selectedAccount.balance >= Number(schema.amount);
      },
      { message: dict.insufficientBalance, path: ["amount"] },
    );
