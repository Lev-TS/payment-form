"use client";

import React from "react";
import { useForm } from "react-hook-form";

import { useLang } from "@/hooks/useLang";
import { validateIban } from "@/lib/client.utils";
import { zodResolver } from "@hookform/resolvers/zod";

import type { PaymentFormDataType, PaymentFormProps } from "./types";
import { Card } from "../ui/card";
import { FORM_ID, getInputFieldOptions } from "./constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Spinner } from "../Spinner/component";
import { SubmitButton } from "../SubmitButton/component";
import { getPaymentFormSchema } from "./schema";
import { toast } from "../ui/use-toast";

export const PaymentForm: React.FC<PaymentFormProps> = ({
  defaultPayerAccount,
  payerAccountsWithPositiveBalance,
  dict,
}) => {
  const lang = useLang();

  const PaymentFormSchema = getPaymentFormSchema({ dict, payerAccountsWithPositiveBalance });

  const form = useForm<PaymentFormDataType>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      amount: 0,
      payeeAccount: "",
      purpose: "",
      payerAccount: defaultPayerAccount.iban,
      payee: "",
    },
  });

  const onSubmit = async (formData: PaymentFormDataType) => {
    // To save time, I'm taking a shortcut and validating iban on form submission. Technically,
    // it's a better user experience to validate it before. That could be achieved with
    // async validator and debounced input, or with more complex flow.
    const response = await validateIban(formData.payeeAccount);

    if (response.error) {
      form.setError("payeeAccount", {
        message: response.error.message,
      });
      return;
    }

    if (response.data) {
      toast({
        title: dict.postSubmitMessage,
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(formData, null, 2)}</code>
          </pre>
        ),
      });
      return;
    }

    form.setError("root", {
      message: dict.serverError,
    });
  };

  if (form.formState.isSubmitting) {
    return <Spinner />;
  }

  return (
    <div className="flex h-full flex-col items-stretch">
      <div className="flex flex-1 flex-col justify-center">
        <div className="px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id={FORM_ID} className="m-auto flex max-w-sm flex-col">
              <Card className="space-y-6 p-6 py-9">
                <FormField
                  control={form.control}
                  name="payerAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-bold">{dict.payerAccount}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="min-h-[60px]">
                          <SelectTrigger>
                            <SelectValue placeholder={dict.selectAccount} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {payerAccountsWithPositiveBalance.map((account) => (
                            <SelectItem value={account.iban} key={account.id}>
                              <div className="font-semibold">{`${dict.account}: ${account.iban}`}</div>
                              <div className="float-left font-thin italic">
                                {`${dict.balance}: ${account.balance.toLocaleString(lang, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {getInputFieldOptions(dict).map(({ name, label }) => (
                  <FormField
                    key={name}
                    name={name}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormLabel className="text-xl font-bold">{label}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder=""
                            className="text-base"
                            onFocus={(event) => event.target.select()}
                            autoComplete={name === "amount" ? "off" : "on"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </Card>
            </form>
          </Form>
        </div>
      </div>
      <div className="border-t bg-background p-3">
        <SubmitButton
          form={FORM_ID}
          disabled={form.formState.isSubmitting}
          isSubmitting={form.formState.isSubmitting}
          text={dict.submit}
        />
      </div>
    </div>
  );
};
