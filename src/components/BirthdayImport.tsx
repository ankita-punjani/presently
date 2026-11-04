"use client";

import { useState, useTransition } from "react";
import { importBirthdaysAction, type ImportResult } from "@/app/calendar/actions";

export function BirthdayImport() {
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isImporting, startImport] = useTransition();

  function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    startImport(async () => setResult(await importBirthdaysAction(await file.text())));
  }

  return (
    <div className="sticker p-5">
      <h3 className="font-display text-xl font-bold">Bring birthdays in 📥</h3>
      <p className="mt-1 text-sm text-ink/70">
        Upload your contacts or a calendar file. New people are added, and existing people only get a birthday if they don’t have one yet.
      </p>
      <label className="btn-pink mt-4 cursor-pointer">
        {isImporting ? "Reading your file…" : "Upload .vcf or .ics file"}
        <input type="file" accept=".vcf,.ics,text/vcard,text/calendar" onChange={onFile} disabled={isImporting} className="sr-only" />
      </label>

      {result && (
        <p role="status" className={`mt-3 rounded-xl border-2 border-ink px-4 py-2 text-sm font-semibold ${"error" in result ? "bg-pink/15" : "bg-lime/40"}`}>
          {"error" in result
            ? result.error
            : `Found ${result.found} ${result.found === 1 ? "birthday" : "birthdays"}: ${result.added} new ${result.added === 1 ? "person" : "people"}, ${result.updated} ${result.updated === 1 ? "birthday" : "birthdays"} filled in, ${result.skipped} already set. 🎉`}
        </p>
      )}

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold">Where do I get this file?</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink/80">
          <li><b>Google Contacts</b>, where most Google birthdays live: contacts.google.com → Export → vCard.</li>
          <li><b>Apple Contacts</b>: select all contacts → File → Export → Export vCard.</li>
          <li><b>Outlook</b>: People → Manage contacts → Export, saved as a .vcf file.</li>
          <li><b>Google Calendar</b>: Settings → Import &amp; export → Export, then unzip and upload the .ics file.</li>
        </ul>
      </details>
    </div>
  );
}
