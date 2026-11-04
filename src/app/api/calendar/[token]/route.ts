import { getFeedBirthdays } from "@/db/queries/calendar";
import { buildBirthdayFeed } from "@/lib/calendar-feed";

// Public on purpose so calendar apps can fetch it, but only with the private token.
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const token = (await params).token.replace(/\.ics$/, "");
  const people = /^[A-Za-z0-9_-]{20,40}$/.test(token) ? await getFeedBirthdays(token) : null;
  if (!people) return new Response("Not found", { status: 404 });

  return new Response(buildBirthdayFeed(people, new URL(request.url).origin), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="presently-birthdays.ics"',
      "Cache-Control": "private, max-age=3600",
    },
  });
}
