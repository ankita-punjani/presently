import { notFound } from "next/navigation";
import { PersonForm } from "@/components/PersonForm";
import { getPerson } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { parseId } from "@/lib/params";
import { updatePersonAction } from "../../actions";

export const metadata = { title: "Edit person · Presently 🎀" };

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const id = parseId((await params).id);
  const person = id && (await getPerson(user.id, id));
  if (!person) notFound();

  return (
    <div className="mx-auto max-w-2xl pt-6">
      <h1 className="mb-6 font-display text-4xl font-extrabold tracking-tight">Edit {person.name} ✏️</h1>
      <PersonForm
        action={updatePersonAction.bind(null, person.id)}
        person={person}
        cancelHref={`/people/${person.id}`}
        submitLabel="Save changes"
      />
    </div>
  );
}
