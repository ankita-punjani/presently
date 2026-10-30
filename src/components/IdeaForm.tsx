import Link from "next/link";
import type { IdeaRow } from "@/db/queries/gift-ideas";
import type { Person } from "@/db/queries/people";
import { OCCASIONS, STATUSES } from "@/lib/idea-options";
import { SubmitButton } from "./SubmitButton";

type Props = {
  action: (form: FormData) => Promise<void>;
  people: Person[];
  categories: { id: number; name: string; emoji: string }[];
  idea?: IdeaRow["idea"];
  personId?: number;
  cancelHref: string;
  submitLabel: string;
};

export function IdeaForm({ action, people, categories, idea, personId, cancelHref, submitLabel }: Props) {
  return (
    <form action={action} className="sticker space-y-4 p-6 sm:p-8">
      <div>
        <label htmlFor="title" className="label">What’s the gift?</label>
        <input id="title" name="title" required className="field" placeholder="Matcha starter kit" defaultValue={idea?.title} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="personId" className="label">Who’s it for?</label>
          <select id="personId" name="personId" required className="field" defaultValue={idea?.personId ?? personId ?? ""}>
            <option value="" disabled>Pick someone</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="categoryId" className="label">Category</label>
          <select id="categoryId" name="categoryId" required className="field" defaultValue={idea?.categoryId ?? ""}>
            <option value="" disabled>Pick a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="price" className="label">Price ($)</label>
          <input id="price" name="price" type="number" min="0" step="0.01" className="field" placeholder="38" defaultValue={idea?.price ?? ""} />
        </div>
        <div>
          <label htmlFor="occasion" className="label">Occasion</label>
          <select id="occasion" name="occasion" className="field capitalize" defaultValue={idea?.occasion ?? "birthday"}>
            {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" name="status" className="field capitalize" defaultValue={idea?.status ?? "idea"}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="store" className="label">Store</label>
          <input id="store" name="store" className="field" placeholder="Etsy" defaultValue={idea?.store ?? ""} />
        </div>
      </div>

      <div>
        <label htmlFor="link" className="label">Link</label>
        <input id="link" name="link" className="field" placeholder="etsy.com/listing/..." defaultValue={idea?.link ?? ""} />
      </div>

      <div>
        <label htmlFor="notes" className="label">Notes</label>
        <textarea id="notes" name="notes" rows={3} className="field" placeholder="Mentioned this at brunch." defaultValue={idea?.notes ?? ""} />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <SubmitButton label={submitLabel} pendingLabel="Saving…" />
        <Link href={cancelHref} className="btn-plain">Cancel</Link>
      </div>
    </form>
  );
}
