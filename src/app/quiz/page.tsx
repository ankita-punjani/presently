import { QuizWizard } from "@/components/QuizWizard";
import { listCategories } from "@/db/queries/gift-ideas";
import { listPeople } from "@/db/queries/people";
import { requireUser } from "@/lib/auth";
import { parseId } from "@/lib/params";

export const metadata = { title: "Gift quiz · Presently 🎀" };

type Props = { searchParams: Promise<{ person?: string }> };

export default async function QuizPage({ searchParams }: Props) {
  const user = await requireUser();
  const [people, categories] = await Promise.all([listPeople(user.id), listCategories()]);
  const startPersonId = parseId((await searchParams).person ?? "") ?? undefined;

  return (
    <QuizWizard
      people={people.map(({ id, name, interests, giftFor, budget }) => ({ id, name, interests, giftFor, budget }))}
      categories={categories.map(({ name, emoji }) => ({ name, emoji }))}
      startPersonId={startPersonId}
    />
  );
}
