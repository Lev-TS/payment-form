export const FORM_ID = "payment-form";

export const inputFieldOptions = [
  {
    name: "amount",
    label: "Amount",
  },
  {
    name: "payee",
    label: "Beneficiary Name",
  },
  {
    name: "payeeAccount",
    label: "Beneficiary Account",
  },
  {
    name: "purpose",
    label: "Purpose",
  },
] as const;
