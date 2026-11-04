// Builds an .ics calendar that Google, Apple and Outlook Calendar can subscribe to.

type FeedPerson = { id: number; name: string; birthday: string };

function escapeText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

// Lines over 75 bytes have to wrap, with the next line starting with a space.
function fold(line: string) {
  const parts: string[] = [];
  let rest = line;
  while (Buffer.byteLength(rest) > 75) {
    let cut = 75;
    while (Buffer.byteLength(rest.slice(0, cut)) > 75) cut--;
    parts.push(rest.slice(0, cut));
    rest = ` ${rest.slice(cut)}`;
  }
  parts.push(rest);
  return parts.join("\r\n");
}

export function buildBirthdayFeed(people: FeedPerson[], siteUrl: string, now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Presently//Birthdays//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Presently birthdays 🎀",
    "X-PUBLISHED-TTL:PT12H",
  ];
  for (const person of people) {
    const [, month, day] = person.birthday.split("-");
    // Feb 29 birthdays show on the last day of February in non-leap years.
    const rule = month === "02" && day === "29" ? "RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=-1" : "RRULE:FREQ=YEARLY";
    lines.push(
      "BEGIN:VEVENT",
      `UID:presently-person-${person.id}@presently`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:2000${month}${day}`,
      rule,
      `SUMMARY:${escapeText(`🎂 ${person.name}’s birthday`)}`,
      `DESCRIPTION:${escapeText(`Gift ideas for ${person.name}: ${siteUrl}/people/${person.id}`)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
