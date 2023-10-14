import React from "react";

import { cn } from "@/lib/tailwind.utils";

import type { SubmitButtonProps } from "./types";
import { Button } from "../ui/button";
import { Spinner } from "../Spinner/component";

export const SubmitButton: React.FC<SubmitButtonProps> = ({ disabled, isSubmitting, form, text, className }) => {
  return (
    <Button form={form} type="submit" className={cn("float-right", className)} disabled={disabled}>
      {isSubmitting ? <Spinner className="h-5 w-5 border-red-500" /> : text}
    </Button>
  );
};
