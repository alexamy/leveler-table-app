# 07 — Keep the mode across clear and restart

**What to build:** the mode is the worker's choice of tool, not part of their data, so clearing the data must not change it. Long-pressing clear at the next location empties the Zero point, the Step and every row, and leaves the worker where they were — a worker recording readings stays in Entered mode, without the Step input reappearing under their thumb.

The mode also has to survive closing the app, and load sensibly for someone who had the app before this feature existed. Their saved state has no mode recorded in it; it should open in Generated mode, exactly as it always did, rather than in whatever an absent value happens to resolve to.

**Blocked by:** 04.

**Status:** ready-for-agent

- [ ] Long-press clear empties the Zero point, the Step and all rows
- [ ] The mode is unchanged by a clear
- [ ] The mode is saved and restored across a restart
- [ ] Saved state recorded before the mode existed loads in Generated mode
