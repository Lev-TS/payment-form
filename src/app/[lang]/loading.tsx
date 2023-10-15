import { Spinner } from "@/components/Spinner/component";

export default function RootLoader() {
  return (
    <div className="absolute right-3 top-4 z-50">
      <Spinner className="h-6 w-6  border-red-900" />
    </div>
  );
}
