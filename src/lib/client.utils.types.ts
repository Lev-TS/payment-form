export interface ValidateIbanApiResponse {
  data?: {
    iban: string;
    valid: boolean;
  };
  error?: {
    message: string;
  };
}
