# Prompt log: Calendar sync (stranger test)

Agent: Claude Code. Branch: `stranger/calendar-sync`. Issue: #80.

## Prompt
> **Me (stranger test feedback):** Implement a feature so that the calendar tab or dashboard is able to sync with GCal or other calendars out there where birthdays might already be added.

## Decision: a free sync that works everywhere, not the Google Calendar API
A direct Google Calendar connection needs a Google Cloud project, sign-in permissions, and Google's app review for calendar access. It also only works with Google. The agent proposed two free pieces that work with every major calendar:

1. **Import:** upload a contacts file (.vcf) or a calendar file (.ics). Most Google birthdays live in Google Contacts, which exports a .vcf file. Apple Contacts and Outlook do too.
2. **Export:** a private `.ics` calendar link. "Add to Google Calendar" opens Google with the link ready to subscribe, and Apple and Outlook use the `webcal://` link. It stays updated, and "Stop syncing" kills the link.

## What the agent did
- `src/lib/birthday-import.ts` reads vCard and iCalendar, including folded lines, `--10-27` dates with no year, `BDAY;VALUE=date:`, and event titles like "Sama's birthday 🎂" or "Birthday: Rosh". Non-birthday events like a dentist appointment are skipped.
- Imports **never overwrite** a birthday. New names become people, and existing people only get a birthday if they don't have one.
- `src/lib/calendar-feed.ts` builds yearly all-day events. Feb 29 birthdays fall on the last day of February in other years.
- **New `calendar_feeds` table** (migration `0010`) holds the private link. The route `/api/calendar/<token>.ics` only ever shows the link owner's people.
- The landing page and README describe the sync.

## How it was checked
- **Browser:** uploading a Google-style contacts file found 3 birthdays, added 2 people and filled in 1 missing birthday, and the calendar grid updated. Creating the link returned a real `text/calendar` file with 3 yearly events. The Google link points at `calendar.google.com/calendar/render?cid=webcal://…`.
- **7 new automated tests:** Google contacts and calendar formats, impossible dates, the feed format, Feb 29, never overwriting, and privacy (User B's people never appear in User A's feed, and a stopped link returns nothing).
- All tests pass.

**Not tested:** actually subscribing in Google Calendar, which needs the live site. Try it once after deploy.
