import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getFeedBirthdays, getFeedToken, importBirthdays, startFeed, stopFeed } from "@/db/queries/calendar";
import { createPerson, listPeople } from "@/db/queries/people";
import { parseBirthdayFile, parseBirthdayValue } from "@/lib/birthday-import";
import { buildBirthdayFeed } from "@/lib/calendar-feed";
import { deleteUsers, signUp, type TestUser } from "./helpers";

// Shaped like a Google Contacts export: folded lines, FN or only N, and both date styles.
const GOOGLE_CONTACTS = [
  "BEGIN:VCARD", "VERSION:3.0", "FN:Priya Shah", "N:Shah;Priya;;;", "BDAY:1999-11-18", "END:VCARD",
  "BEGIN:VCARD", "VERSION:3.0", "N:Mehta;Adhi;;;", "BDAY:--10-27", "END:VCARD",
  "BEGIN:VCARD", "VERSION:3.0", "FN:No Birthday Person", "TEL:555", "END:VCARD",
  "BEGIN:VCARD", "VERSION:4.0", "FN:Very Long Name That Wr", " aps Onto Two Lines", "BDAY;VALUE=date:20000229", "END:VCARD",
].join("\r\n");

const GOOGLE_CALENDAR = [
  "BEGIN:VCALENDAR",
  "BEGIN:VEVENT", "SUMMARY:Sama's birthday 🎂", "DTSTART;VALUE=DATE:19980703", "RRULE:FREQ=YEARLY", "END:VEVENT",
  "BEGIN:VEVENT", "SUMMARY:Birthday: Rosh", "DTSTART;VALUE=DATE:20010915", "END:VEVENT",
  "BEGIN:VEVENT", "SUMMARY:Dentist appointment", "DTSTART:20261105T150000Z", "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

describe("reading birthday files", () => {
  it("reads Google, Apple and Outlook contacts files (.vcf)", () => {
    expect(parseBirthdayFile(GOOGLE_CONTACTS)).toEqual([
      { name: "Priya Shah", birthday: "1999-11-18" },
      { name: "Adhi Mehta", birthday: "2000-10-27" },
      { name: "Very Long Name That Wraps Onto Two Lines", birthday: "2000-02-29" },
    ]);
  });

  it("reads birthday events from calendar files (.ics), and skips everything else", () => {
    expect(parseBirthdayFile(GOOGLE_CALENDAR)).toEqual([
      { name: "Sama", birthday: "1998-07-03" },
      { name: "Rosh", birthday: "2001-09-15" },
    ]);
  });

  it("rejects impossible dates and unknown files", () => {
    expect(parseBirthdayValue("2023-02-31")).toBeNull();
    expect(parseBirthdayValue("--13-01")).toBeNull();
    expect(parseBirthdayFile("just some text")).toEqual([]);
  });
});

describe("calendar feed", () => {
  it("makes yearly all-day birthday events that calendars understand", () => {
    const feed = buildBirthdayFeed([{ id: 7, name: "Adhi", birthday: "2000-10-27" }], "https://example.com", new Date("2026-11-04T00:00:00Z"));
    expect(feed).toContain("BEGIN:VCALENDAR\r\n");
    expect(feed).toContain("DTSTART;VALUE=DATE:20001027");
    expect(feed).toContain("RRULE:FREQ=YEARLY");
    expect(feed).toContain("SUMMARY:🎂 Adhi’s birthday");
    expect(feed.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
  });

  it("puts Feb 29 birthdays on the last day of February in other years", () => {
    const feed = buildBirthdayFeed([{ id: 1, name: "Leap", birthday: "2000-02-29" }], "https://example.com");
    expect(feed).toContain("RRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=-1");
  });
});

describe("import and feed, with real accounts", () => {
  let userA: TestUser;
  let userB: TestUser;

  beforeAll(async () => {
    userA = await signUp("Calendar A");
    userB = await signUp("Calendar B");
    await createPerson(userA.id, { name: "Priya Shah" });
    await createPerson(userA.id, { name: "Sama", birthday: "1998-01-01" });
  });

  afterAll(async () => {
    await deleteUsers(userA, userB);
  });

  it("adds new people, fills missing birthdays, and never overwrites one", async () => {
    const summary = await importBirthdays(userA.id, [
      ...parseBirthdayFile(GOOGLE_CONTACTS),
      ...parseBirthdayFile(GOOGLE_CALENDAR),
    ]);
    expect(summary).toEqual({ added: 3, updated: 1, skipped: 1 });

    const people = await listPeople(userA.id);
    expect(people.find((person) => person.name === "Priya Shah")?.birthday).toBe("1999-11-18");
    expect(people.find((person) => person.name === "Sama")?.birthday).toBe("1998-01-01");
  });

  it("a feed link only shows its owner's birthdays, and stops working when turned off", async () => {
    await createPerson(userB.id, { name: "Only B Knows", birthday: "1990-05-05" });
    await startFeed(userA.id);
    const token = (await getFeedToken(userA.id))!;

    const names = (await getFeedBirthdays(token))!.map((person) => person.name);
    expect(names).toContain("Priya Shah");
    expect(names).not.toContain("Only B Knows");

    await stopFeed(userA.id);
    expect(await getFeedBirthdays(token)).toBeNull();
  });
});
