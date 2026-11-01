import { todayString } from "./dates";
import { parseId } from "./params";

export type FormState = {
  errors: Record<string, string>;
  values: Record<string, string>;
};

export const EMPTY_FORM: FormState = { errors: {}, values: {} };

type Values = FormState["values"];

export function readValues(form: FormData, fields: string[]): Values {
  return Object.fromEntries(fields.map((field) => [field, String(form.get(field) ?? "").trim()]));
}

function checkLength(errors: FormState["errors"], field: string, value: string, max: number, label: string) {
  if (value.length > max) errors[field] = `${label} is too long. Keep it under ${max} characters.`;
}

function checkMoney(errors: FormState["errors"], field: string, value: string, label: string) {
  if (!value) return;
  const amount = Number(value);
  if (!Number.isFinite(amount)) errors[field] = `${label} needs to be a number, like 25 or 25.99.`;
  else if (amount < 0) errors[field] = `${label} can’t be negative. If only! 😄`;
  else if (amount >= 1_000_000) errors[field] = `${label} has to be under $1,000,000.`;
}

function checkBirthday(errors: FormState["errors"], value: string) {
  if (!value) return;
  const parsed = new Date(`${value}T00:00:00Z`);
  const isRealDate = /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parsed.getTime());
  if (!isRealDate || parsed.getUTCFullYear() < 1900) errors.birthday = "That date doesn’t look right. Check the year?";
  else if (value > todayString()) errors.birthday = "Birthdays can’t be in the future. Time traveler? 🕰️";
}

// Links become clickable buttons, so only allow web addresses. This blocks things
// like "javascript:..." and lets people paste "target.com/thing" without https.
export function cleanLink(value: string) {
  if (!value) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`);
    const isWeb = url.protocol === "http:" || url.protocol === "https:";
    return isWeb && url.hostname.includes(".") ? url.href : null;
  } catch {
    return null;
  }
}

export function validatePerson(values: Values) {
  const errors: FormState["errors"] = {};
  if (!values.name) errors.name = "Your person needs a name 🙂";
  checkLength(errors, "name", values.name, 100, "That name");
  checkLength(errors, "interests", values.interests, 500, "That list");
  checkLength(errors, "notes", values.notes, 2000, "That note");
  checkMoney(errors, "budget", values.budget, "Budget");
  checkBirthday(errors, values.birthday);
  return errors;
}

export function validateIdea(values: Values) {
  const errors: FormState["errors"] = {};
  if (!values.title) errors.title = "What’s the gift? Give it a name 🎁";
  checkLength(errors, "title", values.title, 200, "That name");
  checkLength(errors, "store", values.store, 100, "That store name");
  checkLength(errors, "notes", values.notes, 2000, "That note");
  if (!parseId(values.personId)) errors.personId = "Who’s this gift for? Pick someone.";
  if (!parseId(values.categoryId)) errors.categoryId = "Pick a category so you can find it later.";
  checkMoney(errors, "price", values.price, "Price");
  if (values.link && !cleanLink(values.link)) {
    errors.link = "That link doesn’t look right. Try something like target.com/thing.";
  }
  return errors;
}
