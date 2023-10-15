import { HomePageDict } from "./types";

export const FORM_ID = "payment-form";

export const getInputFieldOptions = (dict: HomePageDict) =>
  [
    {
      name: "amount",
      label: dict.amount,
    },
    {
      name: "payee",
      label: dict.beneficiaryName,
    },
    {
      name: "payeeAccount",
      label: dict.beneficiaryAccount,
    },
  ] as const;
