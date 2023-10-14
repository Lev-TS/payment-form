export const FORM_ID = "payment-form";

export const inputFieldOptions = [
  {
    name: "amount",
    type: "number",
    label: "Amount",
    step: 0.01,
    min: 0,
    inputMode: "numeric",
  },
  {
    name: "payeeAccount",
    type: "text",
    label: "Payee Account",
  },
  {
    name: "purpose",
    type: "text",
    label: "Purpose",
  },
  {
    name: "payee",
    type: "text",
    label: "Payee",
  },
] as const;
