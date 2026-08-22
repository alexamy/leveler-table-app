# 05 — Hide Step where it does not apply

**What to build:** in Entered mode the Step input is invisible. An Offset there runs from the Zero point straight to the Measurement, with no series to derive, so asking the worker for a Step is asking for a value that does nothing.

It has to vanish without moving anything. The input keeps its place in the layout, so flipping between modes does not shift the rows under the worker's thumb. It also has to be genuinely inert — not focusable, not editable, not reachable by a stray tap on empty-looking space.

The Step value itself is kept. A worker who sets a Step, flips to Entered to record some readings, and flips back finds it still there.

With Step gone, the add button cannot keep demanding it: in Entered mode the Zero point alone is enough to add a row. In Generated mode the gate is unchanged.

**Blocked by:** 04.

**Status:** ready-for-agent

- [ ] The Step input is not visible in Entered mode
- [ ] It still occupies its space — nothing on screen moves when the mode changes
- [ ] While hidden it cannot be focused, edited, or tapped
- [ ] A Step typed before switching is still there after switching back
- [ ] The add button requires the Zero point and the Step in Generated mode, the Zero point alone in Entered mode
