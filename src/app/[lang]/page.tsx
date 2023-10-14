import { PaymentForm } from "@/components/PaymentForm/component";
import { getDictionary } from "@/lib/dictionary.utils";
import { mockAccountsQuery } from "@/lib/api.utils";

import type { RootParams } from "./types";

export default async function HomePage({ params }: RootParams) {
  const dict = await getDictionary(params.lang);
  const payerAccounts = await mockAccountsQuery();

  if (!payerAccounts.some((account) => account.balance > 0)) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="m-10 text-3xl font-bold">{dict.pages.home.insufficientBalance}</div>
      </div>
    );
  }

  return <PaymentForm payerAccounts={payerAccounts} dict={dict.pages.home} />;
}
