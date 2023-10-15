import userEvent from "@testing-library/user-event";
import { describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import dict from "@/dictionaries/lt.json";
import { PaymentForm } from "@/components/PaymentForm/component";
import { toast } from "@/components/ui/use-toast";
import { validateIban } from "@/lib/client.utils";

vi.mock("@/lib/client.utils");
vi.mock("@/components/ui/use-toast");
vi.mock("@/hooks/useLang", () => ({
  useLang: () => "lt",
}));

const homePageDict = dict.pages.home;
const payerAccounts = [
  { id: "1", iban: "LT307300010172619161", balance: 10.89 },
  { id: "2", iban: "LT307300010172619162", balance: 1000.23 },
  { id: "3", iban: "LT307300010172619163", balance: 1 },
];

describe("PaymentForm: Default_UI", () => {
  const setup = () => {
    render(
      <PaymentForm
        dict={homePageDict}
        payerAccountsWithPositiveBalance={payerAccounts}
        defaultPayerAccount={payerAccounts[0]}
      />,
    );
  };

  it("should render the basic form fields", () => {
    setup();

    expect(screen.getByRole("combobox", { name: homePageDict.payerAccount })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: homePageDict.amount })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: homePageDict.beneficiaryAccount })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: homePageDict.beneficiaryName })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: homePageDict.purpose })).toBeInTheDocument();
  });

  it("should render payer account selector with first account by default", () => {
    setup();

    expect(screen.getByText(`${homePageDict.account}: ${payerAccounts[0].iban}`)).toBeVisible();
    expect(screen.getByText(`${homePageDict.balance}: 10,89`)).toBeVisible();
  });
});

describe("PaymentForm: Validator", () => {
  const setup = (isValidIban = true) => {
    const user = userEvent.setup();
    const spy = vi.fn();
    vi.mocked(toast).mockImplementation(({ title }) => spy(title));
    vi.mocked(validateIban).mockReturnValue(
      new Promise((resolve) => {
        const resolveWith = isValidIban
          ? {
              data: {
                iban: payerAccounts[0].iban,
                valid: isValidIban,
              },
            }
          : {
              error: {
                message: dict.api.invalidIban,
              },
            };
        resolve(resolveWith);
      }),
    );

    render(
      <PaymentForm
        dict={homePageDict}
        payerAccountsWithPositiveBalance={payerAccounts}
        defaultPayerAccount={payerAccounts[0]}
      />,
    );

    const formFields = {
      amountInput: screen.getByRole("textbox", { name: homePageDict.amount }),
      beneficiaryAccountInput: screen.getByRole("textbox", { name: homePageDict.beneficiaryAccount }),
      beneficiaryNameInput: screen.getByRole("textbox", { name: homePageDict.beneficiaryName }),
      purposeInput: screen.getByRole("textbox", { name: homePageDict.purpose }),
      submitButton: screen.getByRole("button", { name: homePageDict.submit }),
    };

    return { spy, user, formFields };
  };

  const interact = async ({
    amount = "10",
    payeeAccount = "LT307300010172619164",
    purpose = "Loan",
    payee = "Ona Marija",
    isValidIban = true,
  }: {
    amount?: string;
    payeeAccount?: string;
    purpose?: string;
    payee?: string;
    isValidIban?: boolean;
  } = {}) => {
    const { spy, user, formFields } = setup(isValidIban);

    await user.type(formFields.amountInput, amount);
    await user.type(formFields.beneficiaryAccountInput, payeeAccount);
    await user.type(formFields.beneficiaryNameInput, payee);
    await user.type(formFields.purposeInput, purpose);
    await user.click(formFields.submitButton);

    return { spy, user };
  };

  it("should fail when required fields are not provided", async () => {
    const { user, spy, formFields } = setup();

    await user.click(formFields.submitButton);

    expect(spy).not.toBeCalled();
    expect(await screen.findAllByText(homePageDict.requiredField)).toHaveLength(3);
  });

  it("should render success message when all inputs are correct", async () => {
    const { spy } = await interact();

    expect(spy).toBeCalledWith(homePageDict.postSubmitMessage);
  });

  it("should fail when amount format is not supported", async () => {
    const { spy } = await interact({ amount: "10.000,00" });

    expect(spy).not.toBeCalled();
    expect(await screen.findByText(homePageDict.invalidNumber)).toBeVisible();
  });

  it("should fail when amount is less than min allowed", async () => {
    const { spy } = await interact({ amount: "0" });

    expect(spy).not.toBeCalled();
    expect(await screen.findByText(homePageDict.minPayment)).toBeVisible();
  });

  it("should fail when amount is more than in selected account", async () => {
    const { spy } = await interact({ amount: "100" });

    expect(spy).not.toBeCalled();
    expect(await screen.findByText(homePageDict.insufficientBalance)).toBeVisible();
  });

  it("should fail when iban is not valid", async () => {
    const { spy } = await interact({
      payeeAccount: "a".repeat(32),
      isValidIban: false,
    });

    expect(spy).not.toBeCalled();
    expect(await screen.findByText(dict.api.invalidIban)).toBeVisible();
  });

  it("should fail when purpose is too long", async () => {
    const { spy } = await interact({ purpose: "a".repeat(136) });

    expect(spy).not.toBeCalled();
    expect(await screen.findByText(homePageDict.pleaseShorten.replace("%", "135"))).toBeVisible();
  });

  it("should fail when purpose is too short", async () => {
    const { spy } = await interact({ purpose: "aa" });

    expect(spy).not.toBeCalled();
    expect(await screen.findByText(homePageDict.invalidDescription)).toBeVisible();
  });

  it("should fail when payee name is too long", async () => {
    const { spy } = await interact({ payee: "a".repeat(71) });

    expect(spy).not.toBeCalled();
    expect(await screen.findByText(homePageDict.pleaseShorten.replace("%", "70"))).toBeVisible();
  });
});
