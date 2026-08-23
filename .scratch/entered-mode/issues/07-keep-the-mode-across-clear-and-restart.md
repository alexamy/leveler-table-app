# 07 — Keep the mode across clear and restart

**What to build:** the mode is the worker's choice of tool, not part of their data, so clearing the data must not change it. Long-pressing clear at the next location empties the Zero point, the Step and every row, and leaves the worker where they were — a worker recording readings stays in Entered mode, without the Step input reappearing under their thumb.

The mode also has to survive closing the app, and load sensibly for someone who had the app before this feature existed. Their saved state has no mode recorded in it; it should open in Generated mode, exactly as it always did, rather than in whatever an absent value happens to resolve to.

**Blocked by:** 04.

**Status:** done

- [x] Long-press clear empties the Zero point, the Step and all rows
- [x] The mode is unchanged by a clear
- [x] The mode is saved and restored across a restart
- [ ] ~~Saved state recorded before the mode existed loads in Generated mode~~ — superseded, see Comments

## Comments

Superseded in `99f9fb8`. Saved state is now read all or nothing: a payload missing a field it names is rejected whole and the app opens on defaults. A payload written before `mode` existed has no `mode` field, so that worker opens on an empty table rather than on their Zero point, Step and rows. Only the mode they land in still matches this ticket.

The trade was taken knowingly — the table is a Zero point, a Step and a short column, small enough to retype, and piecing a half-readable payload back together guesses at what the worker measured. See `spec.md`, section Persisted state.

The ticket's other criteria are unaffected: a clear still leaves the mode alone, and the mode still survives a restart.
