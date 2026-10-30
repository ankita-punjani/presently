import { PersonForm } from "@/components/PersonForm";
import { requireUser } from "@/lib/auth";
import { createPersonAction } from "../actions";

export const metadata = { title: "Add someone · Presently 🎀" };

export default async function NewPersonPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl pt-6">
      <h1 className="mb-6 font-display text-4xl font-extrabold tracking-tight">Who’s the lucky one? 🎁</h1>
      <PersonForm action={createPersonAction} cancelHref="/people" submitLabel="Add them" />
    </div>
  );
}
