import { PayerAccounts, ValidateIbanApiResponse } from "./api.types";

export const mockAccountsQuery = (data?: PayerAccounts): Promise<PayerAccounts> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(
        data ?? [
          {
            iban: "LT307300010172619160",
            id: "1",
            balance: 1000.12,
          },
          {
            iban: "LT307300010172619161",
            id: "2",
            balance: 2.43,
          },
          {
            iban: "LT307300010172619162",
            id: "3",
            balance: -5.87,
          },
        ],
      );
    }, 1000),
  );
};

export const createUrl = (path: string) => {
  return window.location.origin + path;
};

export const validateIban = async (iban: string): Promise<ValidateIbanApiResponse> => {
  const url = createUrl(`/api/${iban}`);
  const res = await fetch(new Request(url));

  if (res.ok) {
    return await res.json();
  } else {
    throw new Error("Something went wrong on API server!");
  }
};
