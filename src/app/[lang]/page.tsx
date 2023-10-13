import { getDictionary } from "@/lib/dictionary.utils";
import { type Locale } from "@/i18n.config";

export default async function HomePage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { home } = await getDictionary(params.lang);

  return <div>Home</div>;
}
