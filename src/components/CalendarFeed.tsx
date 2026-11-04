import { setFeedAction } from "@/app/calendar/actions";
import { ShareLink } from "./ShareLink";
import { SubmitButton } from "./SubmitButton";

type Props = { token: string | null; origin: string };

export function CalendarFeed({ token, origin }: Props) {
  const feedPath = token ? `/api/calendar/${token}.ics` : "";
  const webcal = token ? `webcal://${new URL(origin).host}${feedPath}` : "";
  const google = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`;

  return (
    <div className="sticker p-5">
      <h3 className="font-display text-xl font-bold">Show birthdays in your calendar 📤</h3>
      <p className="mt-1 text-sm text-ink/70">
        {token
          ? "Add this private link once and every birthday here appears in your calendar, staying up to date. Your calendar app refreshes it every few hours."
          : "Get a private link for Google, Apple or Outlook Calendar. It only shows names and birthdays."}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {token && (
          <>
            <a href={google} target="_blank" rel="noopener noreferrer" className="btn-pink">Add to Google Calendar</a>
            <a href={webcal} className="btn-plain">Apple / Outlook</a>
            <ShareLink path={feedPath} />
          </>
        )}
        <form action={setFeedAction.bind(null, !token)}>
          <SubmitButton label={token ? "Stop syncing" : "Create my calendar link"} pendingLabel="One sec…" plain={Boolean(token)} />
        </form>
      </div>
    </div>
  );
}
