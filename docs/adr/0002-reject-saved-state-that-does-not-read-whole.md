# Saved state is read whole or not at all

Storage is untrusted — an older build, a partial write, a hand-edited file — and the app used to repair whatever it found field by field: a missing Zero point became blank, a row without a size kept its slot. That spread the persisted contract across four functions and left the app running on a state nobody wrote.

A saved payload now loads only if every field the app names is there and the right shape: `mode` one of the two values, `zero` and `step` text, `measurements` a list of rows each holding text `size` and text `offset`. A missing field, a wrong type, or a payload that is not an object rejects the whole payload, and the app opens on defaults. Fields the app does not name are ignored — nothing reads them, so they cannot fail a load, and dropping a field in a later build does not wipe the table.

The payload is the whole state minus `waitingDeletion` and minus each row's identity (see ADR 0003). Rows keep their `offset` even though every offset is recomputed on load, so a stored row and a state row stay the same shape bar the id.

## Considered Options

- **Repair field by field, as before.** Keeps a worker's Zero point when one row is unreadable, but the app then runs on a mixture of what was saved and what was guessed, and no single place states what a saved payload is.
- **A schema library (valibot).** One schema, an inferred type, and per-field fallbacks. Rejected on cost: a hand-written guard is ~10 lines longer than the schema and adds no dependency, and the fallbacks would have reinstated the field-by-field repair this decision removes.
- **Reject only a misshaped field, default a missing one.** Would have kept pre-`mode` payloads loading. Rejected as a distinction not worth the code: the table is a Zero point, a Step and a short column, small enough to retype.

## Consequences

State saved before `mode` existed carries no `mode` field, so it is rejected and that worker opens on an empty table. Nothing is written on load, so the payload stays in storage and is rejected again on every launch until their first edit overwrites it.

A rejected payload counts as empty, and so does a read that fails at the storage layer — both open the app on defaults and let the next edit overwrite whatever is in storage. A read failure is not a separate case: a storage layer that cannot be read almost certainly cannot be written either, so the `failed` flag that once suppressed writes was defending a window too narrow to pay for.

Storage trouble is never reported to the worker. A failed read is silent and a failed write is swallowed. There is nothing the worker could do with either, and the app has no error surface to put it on.

Writes are not ordered in app code. Both storage modules are serial below us — Android queues every operation through `SerialExecutor`, iOS through a `DISPATCH_QUEUE_SERIAL` method queue — and bridge calls arrive in call order, so two quick edits cannot land out of order. Noted because the absence looks like an oversight otherwise.

Three tests in `persistance.test.tsx` went with the old rule, all deliberately: `fills in fields missing from the saved state` and `blanks a saved row that lost its value` asserted the field-by-field repair and now sit in the reject list instead, and `does not overwrite saved state after a failed read` inverted into `keeps saving after a failed read`.
