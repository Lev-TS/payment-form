export interface PayerAccount {
  id: string;
  iban: string;
  balance: number;
}

export type PayerAccounts = PayerAccount[];

export interface ValidateIbanApiResponse {
  data?: {
    iban: string;
    valid: boolean;
  };
  error?: {
    message: string;
  };
}
