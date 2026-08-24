# 02: Blink the search label

**What to build:** the black radar screen says what it is doing. "Определяем Петрушкина" sits along the bottom, clear of the notch and the home indicator, and fades in and out — full opacity down to nearly invisible and back, over roughly 800 ms each way, for as long as the radar is open.

Green on black, monospace, slightly spaced letters, sentence case as written. The string is the joke, so it is used exactly as spelled here.

The fade runs on the native driver on device, and off it on web, where the native driver is unavailable and would warn.

**Blocked by:** 01.

**Status:** done

- [x] The label reads "Определяем Петрушкина", exactly
- [x] It sits at the bottom of the radar, inside the safe area
- [x] It fades between visible and nearly invisible and keeps going while the radar is open
- [x] It is green, monospace, and not uppercased
- [x] The animation stops when the radar closes
- [x] No native-driver warning on the web build
- [x] Closing the radar still restores the table unchanged
