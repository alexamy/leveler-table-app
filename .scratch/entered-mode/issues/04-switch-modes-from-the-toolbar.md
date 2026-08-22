# 04 — Switch modes from the toolbar

**What to build:** the control that puts the previous ticket in the worker's hands. A two-position switch in the bottom toolbar, flanked by two icons — a robot on the Generated side, a person on the Entered side — so a glance tells the worker whether the app is producing the values or they are.

Flipping it changes the mode and the rows follow the rules already built: to Entered keeps them and makes them editable, to Generated regenerates them. No confirmation yet.

The icons come from the icon set the toolbar's existing buttons already use, so the row stays in one font. The toolbar currently divides its width between three buttons and has to re-divide to fit the switch without crowding or overflow.

**Blocked by:** 03.

**Status:** ready-for-agent

- [ ] A switch in the bottom toolbar flips between the two modes
- [ ] A robot icon marks the Generated side, a person icon marks the Entered side
- [ ] Both icons come from the same icon set as the existing toolbar buttons
- [ ] The toolbar fits four controls without overflowing or crowding the existing three
- [ ] Flipping the switch has the effect on the rows built in ticket 03
- [ ] The switch's position reflects the current mode, including when the app starts from saved state
