import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createBudget } from "@/db/queries/budgets";
import { createIdea, deleteIdea, getIdea, setStar, updateIdea } from "@/db/queries/gift-ideas";
import { createPerson } from "@/db/queries/people";
import { addWish } from "@/db/queries/wishlist";
import { deleteUsers, loadPage, signUp, type TestUser } from "./helpers";

const PERSON = "Priya Isolation";
const IDEA = "Matcha starter kit";
const BUDGET = "Private Holiday Budget";
const WISH = "Private Wish Headphones";

describe("data isolation: User B cannot see User A's data", () => {
  let userA: TestUser;
  let userB: TestUser;
  let personId: number;
  let ideaId: number;

  beforeAll(async () => {
    userA = await signUp("User A");
    userB = await signUp("User B");

    const person = await createPerson(userA.id, { name: PERSON });
    personId = person.id;
    const idea = await createIdea(userA.id, { personId, categoryId: 5, title: IDEA });
    ideaId = idea!.id;
    await setStar(userA.id, ideaId, true);
    await createBudget(userA.id, { name: BUDGET, amount: "300", startDate: "2026-11-01", endDate: "2026-12-31" });
    await addWish(userA.id, { title: WISH, link: null, price: null, notes: null });
  });

  afterAll(async () => {
    await deleteUsers(userA, userB);
  });

  it("User A can see their own person and idea", async () => {
    expect((await loadPage(userA, "/people")).html).toContain(PERSON);
    expect((await loadPage(userA, "/ideas")).html).toContain(IDEA);
    expect((await loadPage(userA, `/ideas/${ideaId}`)).status).toBe(200);
  });

  it("User B's lists don't show User A's data", async () => {
    expect((await loadPage(userB, "/people")).html).not.toContain(PERSON);
    expect((await loadPage(userB, "/ideas")).html).not.toContain(IDEA);
    expect((await loadPage(userB, "/starred")).html).not.toContain(IDEA);
  });

  it("User B can't see User A's budgets or wishlist", async () => {
    expect((await loadPage(userA, "/budgets")).html).toContain(BUDGET);
    expect((await loadPage(userA, "/wishlist")).html).toContain(WISH);
    expect((await loadPage(userB, "/budgets")).html).not.toContain(BUDGET);
    expect((await loadPage(userB, "/wishlist")).html).not.toContain(WISH);
  });

  it("User B gets 404 opening User A's pages directly by ID", async () => {
    expect((await loadPage(userB, `/ideas/${ideaId}`)).status).toBe(404);
    expect((await loadPage(userB, `/ideas/${ideaId}/edit`)).status).toBe(404);
    expect((await loadPage(userB, `/people/${personId}`)).status).toBe(404);
  });

  it("User B can't change, star or attach to User A's data", async () => {
    await updateIdea(userB.id, ideaId, { personId, categoryId: 5, title: "Hacked" });
    await deleteIdea(userB.id, ideaId);
    await setStar(userB.id, ideaId, true);
    const attached = await createIdea(userB.id, { personId, categoryId: 5, title: "Sneaky" });

    expect(attached).toBeNull();
    const idea = await getIdea(userA.id, ideaId);
    expect(idea?.idea.title).toBe(IDEA);
    expect((await loadPage(userB, "/starred")).html).not.toContain(IDEA);
  });
});
