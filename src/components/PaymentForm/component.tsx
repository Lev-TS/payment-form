"use client";

import React from "react";
import { useForm } from "react-hook-form";

import { useLang } from "@/hooks/useLang";
import { validateIban } from "@/lib/client.utils";
import { zodResolver } from "@hookform/resolvers/zod";

import type { PaymentFormDataType, PaymentFormProps } from "./types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { FORM_ID, getInputFieldOptions } from "./constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Spinner } from "../Spinner/component";
import { getPaymentFormSchema } from "./schema";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";

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
    const response = await validateIban(formData.payeeAccount, lang);

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
    return (
      <div className="absolute right-3 top-4 z-50">
        <Spinner className="h-6 w-6  border-red-900" />
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id={FORM_ID}>
          <Card className="m-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">{dict.cardTitle}</CardTitle>
              <CardDescription>{dict.cardDescription}</CardDescription>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="payerAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{dict.payerAccount}</FormLabel>
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
                      <FormLabel className="font-bold">{label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=""
                          type="text"
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
              <FormField
                name="purpose"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel className="font-bold">{dict.purpose}</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="" onFocus={(event) => event.target.select()} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">{dict.submit}</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};
