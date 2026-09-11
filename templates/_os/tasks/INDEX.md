# TASK INDEX

One row per order. Append a `REQ` row **before** starting work, so an interrupted task is still
visible. When you finish, change the first token to `DONE` and append the evidence path.

```
REQ     | YYYY-MM-DD | who | the order, in the Operator's words where possible | status note
DONE    | YYYY-MM-DD | who | the order | evidence: path/to/the/file.md
BLOCKED | YYYY-MM-DD | who | the order | what is blocking, one line
REFUSED | YYYY-MM-DD | who | the order | why, one line + where the reasoning lives
```

**A `DONE` row without an evidence path is invalid.** Self-report is `[CLAIMED]`; the file is
what makes it `[PROVEN]`.

**A `REFUSED` row stays here permanently.** It is how the fleet stops re-litigating settled
questions. Do not delete it later.

**The honest limit.** This index observes nothing. It is exactly as complete as the agents that
write to it, and a task absent from it is not evidence the task never happened — only that nobody
recorded it. Treat every row as a claim with an evidence path attached, never as proof.

---

