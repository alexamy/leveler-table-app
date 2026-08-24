# 03: Draw the sweeping dial

**What to build:** the black screen becomes a radar scope. In the middle, three concentric rings, a horizontal and vertical crosshair, and spokes at 45°, all phosphor green on black with a glow around the dial. A wedge of about 60° sweeps clockwise from the top, once every 4 seconds, trailing a fade behind its leading edge so it reads as a scope rather than a spinning stick.

Nothing is ever found. There are no blips, no contacts, no targets — the sweep goes round forever.

The dial fits the phone it is on: sized off the shorter side of the window, so portrait and landscape both work without special cases. Geometry is drawn in a square unit viewBox so the same drawing scales to any size.

This adds an SVG renderer to the project, pinned to the version bundled with the Expo SDK in use. React Native has no blur, so the glow is layered low-opacity circles rather than a filter. The rotation runs on the native driver on device and off it on web.

**Blocked by:** 02.

**Status:** done

- [x] Three concentric rings, a crosshair and 45° spokes are drawn in green on black
- [x] The dial has a glow around it
- [x] A wedge sweeps clockwise, starting from the top, one revolution every 4 seconds
- [x] The wedge trails a fading edge rather than being a plain line
- [x] Nothing is ever rendered as a target
- [x] The dial fills a sensible share of the screen in portrait and in landscape, on a small phone and a large one, without cropping
- [x] The label still blinks below the dial
- [x] The SVG dependency is pinned to the version bundled with the project's Expo SDK
- [x] No native-driver warning on the web build
- [x] The existing suite passes; the radar tests still open and close the radar
