import { describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import HomePage from "@/app/[lang]/page";
import type { PayerAccounts } from "@/components/PaymentForm/types";
import { mockDatabaseQuery } from "@/lib/utils";

const INSUFFICIENT_BALANCE = "Insufficient Balance";
const PAYMENT_FORM = "Payment Form";
const payerAccounts = {
  withNegativeBalance: { id: "1", iban: "LT307300010172619161", balance: -1 },
  withZeroBalance: { id: "2", iban: "LT307300010172619162", balance: 0 },
  withPositiveBalance: { id: "3", iban: "LT307300010172619163", balance: 1 },
};

vi.mock("@/lib/utils");
vi.mock("@/components/PaymentForm/component", () => ({
  PaymentForm: () => <div>{PAYMENT_FORM}</div>,
}));
vi.mock("@/lib/server.utils", () => ({
  getDictionary: () =>
    new Promise((resolve) =>
      resolve({
        pages: {
          home: {
            insufficientBalance: INSUFFICIENT_BALANCE,
          },
        },
      }),
    ),
}));

describe("HomePage", () => {
  const setup = async (mockedData: PayerAccounts) => {
    vi.mocked(mockDatabaseQuery).mockReturnValue(
      new Promise((resolve) => {
        resolve(mockedData);
      }),
    );

    render(await HomePage({ params: { lang: "en" } }));
  };

  it("should render payment form when at least one account has positive balance", async () => {
    const mockedData = Object.values(payerAccounts);

    await setup(mockedData);

    expect(screen.getByText(PAYMENT_FORM)).toBeVisible();
  });

  it("should render insufficient balance when there are no accounts with positive balance", async () => {
    const mockedData = [payerAccounts.withZeroBalance, payerAccounts.withNegativeBalance];

    await setup(mockedData);

    expect(screen.getByText(INSUFFICIENT_BALANCE)).toBeVisible();
  });
});
