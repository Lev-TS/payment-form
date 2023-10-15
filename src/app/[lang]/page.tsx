import { PaymentForm } from "../../components/PaymentForm/component";
import { getDictionary } from "@/lib/server.utils";
import { mockDatabaseQuery } from "@/lib/utils";

import type { RootParams } from "./types";
import { mockPayerAccountData } from "./constants";

export default async function HomePage({ params }: RootParams) {
  const dict = await getDictionary(params.lang);
  const payerAccounts = await mockDatabaseQuery(mockPayerAccountData);
  const payerAccountsWithPositiveBalance = payerAccounts.filter((account) => account.balance > 0);

  if (payerAccountsWithPositiveBalance.length <= 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="m-10 text-3xl font-bold">{dict.pages.home.insufficientBalance}</div>
      </div>
    );
  }

  return (
    <div className="px-3 py-6">
      <PaymentForm
        defaultPayerAccount={payerAccountsWithPositiveBalance[0]}
        payerAccountsWithPositiveBalance={payerAccountsWithPositiveBalance}
        dict={dict.pages.home}
      />
    </div>
  );
}
