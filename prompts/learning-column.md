# Prompt log: Learning column

Agent: Claude Code. Branch: `docs/learning-column`. Issue: #82.

## Prompt
> **Me:** reword the learning column in plan.md for me. make human language and simplicty to understand should be there whule being technical where required. i have already given all inputs so dont ask them repeatedly

## What the agent did
- Rewrote all 22 Learning cells in plain, first-person language, keeping technical detail where it explains something real: `%` as a database wildcard, whole-cent money math, never trusting what the browser sends.
- Fixed three rows that had gone stale after later changes:
  - **#7 Dashboard:** stats now cover the calendar year.
  - **#11 Gift-finder quiz:** the backup list is now 316 gifts.
  - **Cut list:** the Budgets tab was cut, because of the stranger test rather than time.
- Only table rows changed. The original plan above the table is untouched (`git diff` shows no other lines removed).
