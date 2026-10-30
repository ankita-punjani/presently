// URL ids are user-typed text. Anything that isn't a sensible positive integer
// returns null so the page shows 404 instead of a database error.
export function parseId(value: string) {
  return /^[1-9]\d{0,8}$/.test(value) ? Number(value) : null;
}
