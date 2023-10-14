import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { iban: string } }) {
  const res = await fetch(`https://matavi.eu/validate?iban=${params.iban}`);

  const serverError = { message: "Server Error, please try again later" };

  if (!res.ok) {
    return NextResponse.json({ error: serverError });
  }

  const data = await res.json();

  if (data === null || data.iban !== params.iban) {
    return NextResponse.json({ error: serverError });
  }

  if (!data.valid) {
    return NextResponse.json({ error: { message: "Invalid IBAN" } });
  }

  return NextResponse.json({ data });
}
