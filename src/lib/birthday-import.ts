// Reads birthdays out of the files people already have: contacts exports (.vcf) from
// Google Contacts, Apple Contacts or Outlook, and calendar exports (.ics).

export type ImportedBirthday = { name: string; birthday: string };

const MAX_ENTRIES = 500;
// Contacts with no birth year ("--10-27") get this one. Only month and day are shown.
const UNKNOWN_YEAR = "2000";

// Long lines in both formats continue on the next line after a space or tab.
function unfold(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
}

function value(line: string) {
  return line.slice(line.indexOf(":") + 1).trim();
}

function unescape(text: string) {
  return text.replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1").trim();
}

function isRealDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return year >= 1900 && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

// Accepts 1990-10-27, 19901027, --10-27, --1027, and any of those with a time after them.
export function parseBirthdayValue(raw: string): string | null {
  const text = raw.trim().replace(/T.*$/, "");
  let match = text.match(/^(\d{4})-?(\d{2})-?(\d{2})$/);
  if (match) {
    const date = `${match[1]}-${match[2]}-${match[3]}`;
    return isRealDate(date) ? date : null;
  }
  match = text.match(/^--(\d{2})-?(\d{2})$/);
  if (match) {
    const date = `${UNKNOWN_YEAR}-${match[1]}-${match[2]}`;
    return isRealDate(date) ? date : null;
  }
  return null;
}

export function parseVCard(text: string): ImportedBirthday[] {
  const results: ImportedBirthday[] = [];
  for (const card of unfold(text).split(/BEGIN:VCARD/i).slice(1)) {
    const lines = card.split("\n");
    const field = (name: string) => lines.find((line) => new RegExp(`^${name}[;:]`, "i").test(line));
    const fullName = field("FN") ? unescape(value(field("FN")!)) : "";
    // N is "Last;First;Middle;Prefix;Suffix", used when there's no FN.
    const structured = field("N") ? value(field("N")!).split(";") : [];
    const name = fullName || [structured[1], structured[0]].filter(Boolean).map(unescape).join(" ");
    const birthday = field("BDAY") ? parseBirthdayValue(value(field("BDAY")!)) : null;
    if (name && birthday) results.push({ name, birthday });
  }
  return results;
}

// Turns "Priya's birthday" or "Birthday: Priya 🎂" into "Priya".
function nameFromEvent(summary: string) {
  return summary
    .replace(/[🎂🎉🎈🥳]/gu, "")
    .replace(/^(happy\s+)?birthday\s*[:\-–]?\s*/i, "")
    .replace(/[’']s\s+birthday.*$/i, "")
    .replace(/\s+birthday.*$/i, "")
    .trim();
}

export function parseICS(text: string): ImportedBirthday[] {
  const results: ImportedBirthday[] = [];
  for (const event of unfold(text).split(/BEGIN:VEVENT/i).slice(1)) {
    const lines = event.split("\n");
    const field = (name: string) => lines.find((line) => new RegExp(`^${name}[;:]`, "i").test(line));
    const summary = field("SUMMARY") ? unescape(value(field("SUMMARY")!)) : "";
    const yearly = /FREQ=YEARLY/i.test(field("RRULE") ?? "");
    // Only birthday-like events: "birthday" in the title, or a yearly repeat.
    if (!summary || !(/birthday/i.test(summary) || yearly)) continue;
    const birthday = field("DTSTART") ? parseBirthdayValue(value(field("DTSTART")!)) : null;
    const name = nameFromEvent(summary);
    if (name && birthday) results.push({ name: name.slice(0, 100), birthday });
  }
  return results;
}

export function parseBirthdayFile(text: string): ImportedBirthday[] {
  const entries = /BEGIN:VCARD/i.test(text) ? parseVCard(text) : /BEGIN:VCALENDAR|BEGIN:VEVENT/i.test(text) ? parseICS(text) : [];
  // One entry per name. The first one wins.
  const seen = new Set<string>();
  return entries
    .filter((entry) => {
      const key = entry.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_ENTRIES);
}
