import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createBudget } from "@/db/queries/budgets";
import { getDashboard } from "@/db/queries/dashboard";
import { createIdea } from "@/db/queries/gift-ideas";
import { createPerson } from "@/db/queries/people";
import { deleteUsers, signUp, type TestUser } from "./helpers";

const DURING_THE_SEASON = "2026-11-15";

describe("dashboard: total spent and average gift", () => {
  let user: TestUser;

  beforeAll(async () => {
    user = await signUp("Dashboard User");
    await createBudget(user.id, {
      name: "Holidays 2026",
      amount: "300",
      startDate: "2026-11-01",
      endDate: "2026-12-31",
    });

    const person = await createPerson(user.id, { name: "Priya" });
    const gift = (title: string, price: string, status: string, boughtOn: string | null) =>
      createIdea(user.id, { personId: person.id, categoryId: 5, title, price, status, boughtOn });

    await gift("Bought on Nov 5", "20", "bought", "2026-11-05");
    await gift("Given on Nov 20", "30", "given", "2026-11-20");
    await gift("Bought on Dec 1", "50", "bought", "2026-12-01");
    await gift("Still just an idea", "100", "idea", null);
  });

  afterAll(async () => {
    await deleteUsers(user);
  });

  it("adds up what was bought or given, and leaves out the unbought idea", async () => {
    const { stats, seasonLabel } = await getDashboard(user.id, DURING_THE_SEASON);

    expect(seasonLabel).toBe("Holidays 2026");
    expect(stats.totalSpent).toBe(100);
    expect(stats.averageGift).toBe(33.33);
    expect(stats.giftsBought).toBe(3);
    expect(stats.ideasNotBought).toBe(1);
  });
});
