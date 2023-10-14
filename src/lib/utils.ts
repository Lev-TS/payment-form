import { i18n } from "@/i18n.config";

export const mockDatabaseQuery = <T>(data: T): Promise<T> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(data);
    }, 500),
  );
};

export const parseLocalizedNumber = (userInput: string): number | typeof NaN => {
  for (const format of i18n.supportedNumberFormats) {
    const formattedInput = userInput.replace(format.separator, "").replace(format.decimal, ".");

    const parsedNumber = Number(formattedInput);

    if (!isNaN(parsedNumber)) {
      return parsedNumber;
    }
  }

  return NaN;
};
