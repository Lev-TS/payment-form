import { NextResponse } from "next/server";

import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/server.utils";

export async function GET(_: Request, { params }: { params: { iban: string; lang: Locale } }) {
  const dict = await getDictionary(params.lang);

  try {
    const res = await fetch(`https://matavi.eu/validate?iban=${params.iban}`);

    if (!res.ok) {
      return NextResponse.json({
        error: {
          message: dict.api.mataviError,
        },
      });
    }

    const data = await res.json();

    if (data === null) {
      return NextResponse.json({
        error: {
          message: dict.api.mataviError,
        },
      });
    }

    if (!data.valid) {
      return NextResponse.json({
        error: {
          message: dict.api.invalidIban,
        },
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      error: {
        message: dict.api.serverError,
      },
    });
  }
}
