import { ValidateIbanApiResponse } from "./client.utils.types";

export const validateIban = async (iban: string): Promise<ValidateIbanApiResponse> => {
  const url = `${window.location.origin}/api/${iban}`;
  const res = await fetch(new Request(url));

  if (res.ok) {
    return await res.json();
  } else {
    throw new Error("Something went wrong on API server!");
  }
};
