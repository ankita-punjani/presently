import Link from "next/link";
import type { Person } from "@/db/queries/people";
import { GIFT_FOR, RELATIONSHIPS } from "@/lib/people-options";
import { SubmitButton } from "./SubmitButton";

type Props = {
  action: (form: FormData) => Promise<void>;
  person?: Person;
  cancelHref: string;
  submitLabel: string;
};

export function PersonForm({ action, person, cancelHref, submitLabel }: Props) {
  return (
    <form action={action} className="sticker space-y-4 p-6 sm:p-8">
      <div>
        <label htmlFor="name" className="label">Name</label>
        <input id="name" name="name" required className="field" placeholder="Priya" defaultValue={person?.name} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="relationship" className="label">Relationship</label>
          <select id="relationship" name="relationship" className="field capitalize" defaultValue={person?.relationship ?? "friend"}>
            {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="giftFor" className="label">Shopping for</label>
          <select id="giftFor" name="giftFor" className="field capitalize" defaultValue={person?.giftFor ?? "no preference"}>
            {GIFT_FOR.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="birthday" className="label">Birthday</label>
          <input id="birthday" name="birthday" type="date" className="field" defaultValue={person?.birthday ?? ""} />
        </div>
        <div>
          <label htmlFor="budget" className="label">Budget ($)</label>
          <input id="budget" name="budget" type="number" min="0" step="0.01" className="field" placeholder="50" defaultValue={person?.budget ?? ""} />
        </div>
      </div>

      <div>
        <label htmlFor="interests" className="label">Interests</label>
        <input id="interests" name="interests" className="field" placeholder="matcha, pottery, plants" defaultValue={person?.interests ?? ""} />
        <p className="mt-1 text-sm text-ink/60">Separate them with commas.</p>
      </div>

      <div>
        <label htmlFor="notes" className="label">Notes</label>
        <textarea id="notes" name="notes" rows={3} className="field" placeholder="Allergic to lavender. Loves anything green." defaultValue={person?.notes ?? ""} />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <SubmitButton label={submitLabel} pendingLabel="Saving…" />
        <Link href={cancelHref} className="btn-plain">Cancel</Link>
      </div>
    </form>
  );
}
