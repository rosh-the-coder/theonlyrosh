# Performance, stability, and reliability audit

Audit only. No application code was changed.

Date: 23 September 2026  
Branch: `audit/performance-stability`  
Stack: Next.js 14.0.0, React 18.2, App Router, Tailwind 3.3

## Executive Summary

The site feels slow, and can make a weaker computer feel slow, because the homepage keeps doing expensive work after it has loaded. The JavaScript download is not the main cause. A production build of `/` is 353 kB of gzipped JavaScript (about 1.3 MB uncompressed). That is a moderate payload. The damage is what that code does every frame, on every mouse move, and while sections are off screen.

Four behaviours explain the reports:

1. **The custom cursor blocks the main thread continuously.** On the homepage and on every video-editing route it stores the pointer in React state, walks the DOM with `elementFromPoint` and `getComputedStyle` on every `mousemove`, and calls `setState` from a `requestAnimationFrame` loop for the whole visit. The cursor is positioned with `left` and `top`, which forces layout. The effect that owns the listeners depends on the mouse coordinates, so every move tears the listeners down and puts them back.

2. **The homepage runs a full-viewport WebGL effect for the entire visit, including after the hero has scrolled away.** `Hero` uses `frameloop="always"`. Each frame does two fullscreen shader passes into render targets scaled up to 1.5× device pixel ratio. Scrolling the showreel also re-renders `Hero`, and `RippleReveal` rebuilds its text texture because the text arrays are new objects on every render. A second WebGL scene (bloom, analog post, 20 point lights) starts as soon as its chunk loads, whether or not that section is on screen.

3. **That second WebGL loop is not cancelled.** Leaving the homepage, or opening the Unity modal, disposes the renderer and then keeps scheduling frames. Repeating that accumulates work. This matches “parts occasionally break” and memory that grows as someone navigates.

4. **Video bytes are very large, but the grids do not decode every video at once.** Portfolio pieces play one file at a time, which is the right structure. The files themselves are not. Measured examples: Self Control 281 MB `.MOV`, a Two Blokes reel 152 MB, an AI Marketing clip 115 MB, a ShowItOn clip 91 MB. The homepage also starts a 14.7 MB showreel while it is still off screen, and the About POV (17.0 MB) starts as soon as that section’s chunk loads. The story page preloads a 55.5 MB file and seeks it on every scroll frame.

The existing “low power” switch almost never turns on. It requires `navigator.hardwareConcurrency <= 2`. Phones and cheap laptops usually report 4–8 cores and a weak GPU, so they get the full desktop effect.

The adaptive threshold, the cursor, and the always-on WebGL loops are the difference between a fast desktop and a machine that feels stuck.

## How the application is put together

Almost every interactive surface is a client component. `src/app/page.tsx` is `'use client'` and returns `null` until a mount effect runs, so the homepage HTML is empty. The production build logs `Not initialized yet, returning null` while prerendering `/`. Visitors wait for JavaScript, then a 3 second countdown, while the heavy tree is already mounted underneath at `opacity: 0`.

Persistent across the homepage visit:

| System | Where | Lifetime |
| --- | --- | --- |
| Audio provider | `src/app/providers.tsx` | Whole app |
| Google Analytics | `src/components/GoogleAnalytics.tsx` | Whole app, `afterInteractive` |
| Custom cursor | Homepage and `src/app/video-editing/layout.tsx` | While those routes are mounted |
| Hero WebGL (`three` + `@react-three/fiber`) | `Hero` → `RippleReveal` | Whole homepage visit, desktop |
| Showreel `<video>` | `Showreel` | Mounted immediately, `preload="auto"` |
| Navigation clock | `Navigation` | 1 Hz interval |
| Smooth scroll hook | `useSmoothScrollBetter` | Sets CSS `scroll-behavior` once |
| Lazy sections | About, Work, Services, TechStack, footer, Spookie Pookie | Downloaded as soon as the homepage renders, not when scrolled into view |

Route-specific:

| Route | Heavy systems |
| --- | --- |
| `/` | Cursor, hero WebGL, showreel video, ghost WebGL, GSAP services, Unity only if opened |
| `/video-editing` | GSAP carousel, cursor, one modal `<video>` |
| `/video-editing/work/irish-ai-creative` | 60 poster images, 5 masonry grids, cursor, one modal `<video>` |
| `/video-editing/work/two-blokes-trading` | Small poster set, YouTube embeds or one file in a modal, cursor |
| `/project/[id]` | One full case-study image |
| `/story` | Redirects to `public/story.html`, a scroll-scrubbed video with no React |

`@react-three/drei`, `three-stdlib`, `three-mesh-bvh`, and `split-type` are dependencies and are not imported anywhere under `src/`. They are not in the runtime graph.

## Critical Issues

### 1. Custom cursor updates React on every frame and forces layout on every mouse move

**Files:** `src/components/UI/CustomCursor.tsx`  
Mounted from `src/app/page.tsx` and `src/app/video-editing/layout.tsx`.

**Evidence:**

- `updateMousePosition` calls `setMousePos` on every `mousemove`.
- The effect dependency list is `[mousePos.x, mousePos.y]` (line 132). Each move runs cleanup and setup again: two `mousemove` listeners are removed and re-added, and a new animation frame is started.
- `animateTrail` calls `setTrailPos` inside `requestAnimationFrame` and reschedules itself forever, even when the pointer is still.
- `handleMouseMove` calls `document.elementFromPoint` and then `getComputedStyle` while walking ancestors, then `setCursorColor` and `setIsHovering`, on every move.
- The dot and the ring are placed with inline `left` and `top`, not a transform alone.

**What this does:** A stationary pointer still re-renders this component about 60 times a second. A moving pointer adds forced style and layout work on the whole document, listener churn, and more renders. `getComputedStyle` flushes pending layout. On a page that already has a WebGL canvas and a decoding video, that flush is paid on the main thread for the entire visit. This is the behaviour most likely to make the rest of the machine feel sluggish, because the main thread stays busy whenever the pointer moves, including over other applications’ ability to get time if this tab is in front.

**User impact:** Desktop and laptop visitors, on the homepage and on all video-editing pages. Mobile returns `null` after mount, so phones skip the cursor. The effect still runs its setup once before `isMobile` is known.

**Proposed fix:** Keep the same dot, ring, colour, hover scale, and trailing delay. Drive both elements from one `requestAnimationFrame` loop that writes `transform` on refs. Read the pointer into a ref. Sample the background colour only when the element under the pointer changes, not on every event. Remove `mousePos` from the effect dependencies so the loop is created once. Do not change the visual timing constant (`0.12`).

**Regression risk:** Medium if the colour sampling is simplified carelessly. The colour is meant to invert the background under the pointer. The fix should preserve that result and only change how often it is computed.

### 2. Hero WebGL never stops, and scrolling rebuilds it

**Files:** `src/components/Hero/Hero.tsx`, `src/components/RippleReveal.tsx`, `src/components/Sections/Showreel.tsx`

**Evidence:**

- Desktop hero renders `<Canvas frameloop="always">`. The section is `fixed inset-0` and stays mounted. Scrolling translates it off screen. The canvas keeps drawing.
- Each frame runs two fullscreen passes (mask target, then composite) and allocates `new Float32Array(80)` (`RippleReveal.tsx` around the water-ripple update).
- Render-target size is `viewport × min(devicePixelRatio, maxDPR)`. `maxDPR` is 1.5 unless low-power mode is on.
- `lowPowerMode` is `hardwareConcurrency <= 2` only. Antialiasing, pixel ratio, brush radius, and frame skipping all key off that flag.
- `pointermove` is bound to `window`, and every move calls `getBoundingClientRect`.
- `Showreel` dispatches `showreel-coverage-update` on every scroll-progress change. `Hero` stores that in state, so `Hero` re-renders through the showreel scroll.
- `textElements` and `iconElements` are inline arrays in `Hero`’s render. `RippleReveal` recreates the 1200×600 text canvas whenever those references change (`useEffect` dependency `[p.text, p.textElements, p.iconElements]`).
- The portrait texture is `/rosh-placeholder.jpg` (3.01 MB).

**What this does:** From the first moment the hero mounts until the visitor leaves the homepage, the GPU fills the viewport twice per frame. During the showreel scroll, React also rebuilds the text texture and reloads the icon image. Weak integrated GPUs spend their frame budget here, so scrolling, video, and the cursor all miss frames. A 4-core laptop still takes the full effect.

**User impact:** Every desktop homepage visit, worst while the pointer moves or the showreel is scrolling. Phones avoid the steady-state canvas only after an effect sets `isMobile`. The first client render still has `isMobile === false`, so a phone mounts the WebGL canvas and then tears it down. The Three.js chunk is on the homepage critical path either way (670 KB uncompressed `b536a0f1-….js`, plus a 148 KB chunk that also contains Three.js).

**Proposed fix:** Keep the ripple, the reveal, and the typography. Pause `frameloop` when the hero is off screen or the tab is hidden (`document.visibilityState`). Pass stable text and icon arrays so a coverage update does not rebuild textures. Reuse one ripple buffer instead of allocating a `Float32Array` per frame. Decide mobile vs desktop before creating the canvas (a synchronous viewport check, or a CSS-only first frame). Widen the performance scale beyond “2 cores or fewer”, using signals such as `devicePixelRatio`, a short frame-time sample, and `prefers-reduced-motion`, without a user-agent check. Leave the shader look the same on machines that are keeping up.

**Regression risk:** High if the canvas is unmounted instead of paused. Unmounting resets the ripple mask. Pausing the frame loop and skipping prop-driven texture rebuilds preserves the image. The mobile/desktop switch must not flash the wrong layout.

### 3. Spectral ghost WebGL loop leaks, and it runs while off screen

**Files:** `src/components/Sections/Intro_Spooky-Pookie.tsx`, mounted by `src/components/SpookiePookieEntry.tsx` on the homepage.

**Evidence:**

- The section is a full viewport (`height: 100svh`) with `UnrealBloomPass`, a custom analog pass (grain, bleed, scanlines, extra texture samples), antialiasing, and pixel ratio up to 1.75.
- Twenty fireflies each add a `PointLight`.
- `animate` calls `requestAnimationFrame(animate)` and then `composer.render()`.
- Cleanup disconnects the resize observer, removes the mouse listener, and disposes the composer and renderer. It never calls `cancelAnimationFrame`.
- The effect depends on `showControls`. Opening the Unity modal sets `showControls` to false, which re-runs the effect. The old loop keeps scheduling frames on a disposed renderer. Closing the modal starts another scene.
- `SpookiePookieEntry` is rendered as soon as the homepage renders. The chunk is not deferred until the section is near the viewport.
- A Tweakpane panel is created on desktop (`expanded: true`) with document-level mouse listeners that the cleanup function does not remove. The pane host is shifted down and the section is `overflow: hidden`, so the panel may be clipped, but it still mounts.

**What this does:** Shortly after homepage load there are two live WebGL scenes: the hero and this one, even if the visitor is still on the hero. Navigating to another route, or opening and closing the game, leaves the ghost loop running. Because the next frame is scheduled before `composer.render()`, a throw after dispose does not stop the loop.

**User impact:** Homepage CPU/GPU stays high below the fold. Repeated navigation or repeated game opens is the accumulation case. This is the clearest memory/CPU leak in the repo.

**Proposed fix:** Store the frame id and cancel it in cleanup. Start the loop only while the section intersects the viewport and the tab is visible. Keep bloom, the ghost, and the fireflies when it is on screen. Do not ship the Tweakpane UI. Remove its listeners with the rest of the effect.

**Regression risk:** Medium. Pausing off screen does not change what people see when they reach the section. Cancelling the frame on unmount is required for the current look to survive navigation. Removing Tweakpane changes a control panel that reads as a debug tool. If that panel is intentional, stop and keep it. The leak fix does not depend on removing it.

### 4. Homepage videos start decoding before they are visible

**Files:** `src/components/Sections/Showreel.tsx`, `src/components/Hero/Hero.tsx`, `src/components/Sections/About.tsx`, `src/app/page.tsx`

**Evidence:**

| File | Size | When it starts |
| --- | --- | --- |
| `public/videos/theonlyrosh-showreel-fixed.mp4` | 14.71 MB | Showreel mounts with `preload="auto"`, `autoPlay`, and `play()` on mount. At scroll progress 0 the clip is translated off the right edge. Pause only happens later, inside a scroll-progress listener. |
| Same file, hero mobile branch | 14.71 MB | Mobile hero uses the landscape file, not `theonlyrosh-showreel 9-16.mp4` (20.20 MB). |
| `public/videos/POV.mp4` | 16.96 MB | About is lazy-loaded but rendered immediately inside `Suspense`, with `autoPlay`. No viewport check. |
| `public/videos/web fin.mp4` | 55.48 MB | Story page only. See below. |

The loading screen does not delay this. `isLoading` only sets `opacity-0` on `<main>`. `Hero`, `Showreel`, and the lazy sections mount during the countdown.

`Showreel`’s scroll listener also calls `setIsMuted` on progress changes, and the coverage event re-renders `Hero` and `Navigation`. That ties video scroll to the WebGL rebuild in issue 2.

**What this does:** A cold homepage load can be decoding the showreel while the GPU is already filling the hero, before the visitor has scrolled. About adds a second decoder once its chunk arrives. Mobile still downloads and parses Three.js, then plays a 14.7 MB video.

**User impact:** First load and the first scroll, especially on laptops and phones. This is network plus decoder load, separate from the cursor.

**Proposed fix:** Keep autoplay once the showreel or POV is actually entering the viewport. Use `preload="metadata"` until then, then call `play()`. Pause when the element leaves, which the showreel listener already tries to do after the first scroll. On small screens, use the 9:16 showreel in the hero if that is the intended mobile frame, and do not also mount a second copy. Do not change the edit or the audio toggle.

**Regression risk:** Medium around autoplay policies. Muted inline playback should still be allowed. The sound toggle must keep working when the clip is on screen.

### 5. A single opened portfolio video is large enough to stall a machine

**Files:** `src/components/VideoEditing/VideoEditing.tsx`, `src/components/VideoEditing/IrishAICreative.tsx`, `src/components/VideoEditing/TwoBlokesTrading.tsx`

**Evidence:** The grids do **not** mount a `<video>` per card. Video Editing uses `next/image` posters and one modal player. Irish AI and Two Blokes use `<img>` posters and open one file, or a YouTube iframe, on click. That part is sound.

The bytes behind one click are not. `HEAD` requests on 23 September 2026:

| Asset | Size | Type |
| --- | --- | --- |
| `…/10. Self Control.MOV` | 281.42 MB | `video/quicktime` |
| `…/two-blokes-trading/reels/01.mp4` | 151.68 MB | `video/mp4` |
| `…/irish-ai-creative/ai-marketing/1.mp4` | 114.85 MB | `video/mp4` |
| `…/irish-ai-creative/showiton/01.mp4` | 90.69 MB | `video/mp4` |
| `…/irish-ai-creative/willy-jean-luc/01.mp4` | 50.87 MB | `video/mp4` |
| `…/1. Film Grains.mp4` | 49.86 MB | `video/mp4` |
| `…/irish-ai-creative/gtd/01.mp4` | 44.46 MB | `video/mp4` |
| `…/irish-ai-creative/ugc/01.mp4` | 20.09 MB | `video/mp4` |

ShowItOn poster `01.jpg` is 0.13 MB. Sixty posters in that range are on the order of 10 MB, not hundreds. The grid is not the incident. Playback is.

`10. Self Control.MOV` is QuickTime. Chrome often cannot play `.mov`. `12. Sonic Boom.m4v` is the same class of risk. That is a functional break, not only a slowdown.

Local copies under `public/video editing/videos/` match these sizes (Self Control 281 MB, Flashback 164 MB) but the UI requests the R2 URLs, not those local paths.

**User impact:** Opening one piece on a laptop or phone downloads tens or hundreds of megabytes and then decodes it full-frame in a modal. Visitors describe this as the site, or the device, locking up. Some tiles never play.

**Proposed fix:** Do not change the grid, hover, or modal. Re-encode the playback files to a browser-safe MP4 (H.264 + AAC) at a size appropriate to a phone-width player. Keep masters offline. Add `preload="metadata"` on the modal element. Do not mount the element until the modal opens, which is already the case.

**Regression risk:** Low for the player code. High if encodes are done carelessly and quality drops in a way you can see. Encoding should be a separate, reviewed pass. Until new files exist, the code change is limited to preload and to swapping known-bad extensions only when a replacement file is ready.

## High Priority

### Showreel scroll re-renders the hero and the nav on every tick

**Files:** `Showreel.tsx` (coverage dispatch and `setIsMuted`), `Hero.tsx`, `Navigation.tsx`

`scrollYProgress.on('change')` fires through the showreel. Both listeners write React state with the raw progress float. `Navigation` then recomputes opacity from that float. The scroll listener that only toggles `scrolled` is already throttled with `requestAnimationFrame` and is fine.

**Proposed fix:** Have the showreel write coverage into a ref or a CSS variable, and update React state only when a threshold is crossed (fade start, fade end, exit). Keep the same fade distances.

**Regression risk:** Low if the thresholds stay the same.

### Global `will-change` promotes every inline transform and opacity

**File:** `src/app/globals.css` (the block commented “GPU acceleration hints”)

```css
.smooth-transition,
.parallax,
.floating,
.glow,
[style*="transform"],
[style*="opacity"] {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

Any element whose `style` attribute contains the substring `transform` or `opacity` gets a permanent compositor layer. Framer Motion, the hero’s `translateY`, the cursor, and the showreel all match. `will-change` is meant for a short animation, not for the life of the page. The extra `transform` loses to inline styles, so it does not replace those transforms, but `will-change` still applies.

**Proposed fix:** Delete this blanket rule. Keep `will-change` on elements that actually animate, and only while they animate, if a specific element still needs it.

**Regression risk:** Low. This rule does not create the visual design. Removing it can only reduce layer memory. Check the showreel and hero scroll once after removal.

### Services scroll work, and several pins on one element

**File:** `src/components/Sections/Services.tsx`

`animateSkillTags` runs on every `scroll` event, not once per frame, and is not passive. For each `.skill-tag` it calls `getBoundingClientRect`. Hover handlers are attached inside the effect and are not removed individually (they die with the node on unmount, so this is not an accumulating leak).

Four desktop ScrollTriggers and four mobile ones each set `pin: container` on the same element, chained by id. GSAP expects one pin per element. Overlapping pins are a credible cause of sections jumping, sticking, or measuring the wrong height. That fits “occasionally break” better than a random render bug.

**Proposed fix:** Drive the tag offset from one `requestAnimationFrame` scroll handler, or from the existing ScrollTrigger’s `onUpdate`, and skip it when the section is off screen. Rebuild the card motion as one pinned timeline so the element is pinned once. Keep the same distances (`80px`, `160px`, `240px`, `320px`) and the same breakpoint.

**Regression risk:** High on the services stack. This needs a visual check at desktop and mobile widths before it is considered safe. If the current pin chain is load-bearing in a way the timeline does not reproduce, stop and document the difference.

### Story page seeks a 55 MB video on every frame

**File:** `public/story.html`  
`/story` only redirects here.

`preload="auto"` on `/videos/web fin.mp4` (55.48 MB). The scroll handler sets `video.currentTime = fraction * video.duration` inside `requestAnimationFrame`. Seeking an unindexed, long GOP file every frame forces the decoder to throw away work. This page is isolated from the React app, so it does not slow the homepage. It does explain a bad experience on that URL.

**Proposed fix:** Encode a mezzanine with frequent keyframes specifically for scrubbing, or scrub a frame sequence. Keep the chapter timing and the pinned full-viewport presentation.

**Regression risk:** Medium. Scrubbing feel depends on keyframe interval. Do not change chapter copy or the 600vh scroll length without checking the sync.

### Project case studies ship 30 MB PNGs

**File:** `src/app/project/[id]/page.tsx`

Raw `<img>` tags, not `next/image`:

- `public/Work/PowerStride/PowerStride Case Study.png` — 32.42 MB
- `public/Work/RVV/RVV Case Study.png` — 30.83 MB
- `public/Work/TFA/TFA.png` — 2.71 MB

**Proposed fix:** Serve a resized, compressed image at the displayed width. Keep the same crop and the long-scroll layout.

**Regression risk:** Low if the displayed dimensions stay the same.

### Fonts block first paint, and Inter is requested twice

**File:** `src/app/layout.tsx`, also `src/app/globals.css` line 1

The root layout loads `next/font` Inter and a render-blocking Google stylesheet that requests Inter again, plus JetBrains Mono (4 weights), Climate Crisis, Imbue (9 weights), Teko (5 weights), Big Shoulders Stencil Text (4 weights), and League Gothic. `globals.css` imports JetBrains Mono a second time. Story adds Space Grotesk.

Teko, Big Shoulders, and League Gothic are used. Imbue appears in CSS. Many of the extra weights have no corresponding `font-weight` in the components that were inspected.

**Proposed fix:** Keep the families that are on screen. Load the weights that are actually used, with `display=swap` (already set on the Google URL). Drop the duplicate Inter and the duplicate JetBrains import.

**Regression risk:** Low if a weight is removed only after checking the computed styles. Missing a weight causes a fallback, which is a visual change, so confirm before deleting a weight.

### Unity session stacks a second full-screen canvas on top of a 113 MB game

**Files:** `src/components/Sections/SP-webgl.tsx`, `src/components/ParticleBackground.tsx`

The live build is `webgl-game.data` (91.87 MB) plus `webgl-game.wasm` (21.22 MB). That download is expected for this Unity project and only happens when the modal opens.

While it is open, `ParticleBackground` runs 200 canvas particles on a full-window 2D canvas, clearing the frame every tick, with a `mousemove` listener. Its `requestAnimationFrame` is cancelled on close, so this one does not leak. It does compete with Unity for the GPU during play. The particle canvas is `z-index: 1` and the game frame is `z-20`, so it should not steal clicks.

**Proposed fix:** Pause the particle canvas when the Unity canvas is the thing the visitor is looking at, or drop the particle count only while the game is running, if the particles are still meant to be visible around the frame. Do not change the game.

**Regression risk:** Low if the particles remain visible around the frame at a lower cost. Confirm they are actually visible before changing them. If they are hidden behind the game, they are pure waste and can pause for the whole modal.

## Medium Priority

### Loading screen can finish twice

**File:** `src/components/LoadingScreen.tsx`

The countdown calls `onComplete` about 3.8 s after mount (100 steps, then 300 ms, then 500 ms). A fallback calls `onComplete` at 3.0 s. `handleLoadingComplete` in `page.tsx` is not stable, and it schedules the “scroll to work” timeout. Two completions can schedule that scroll twice.

**Proposed fix:** One completion path. Keep the 3 second countdown and the fade.

**Regression risk:** Low.

### Masonry scroll reads layout for every card, once per grid

**File:** `src/components/UI/masonry-grid-with-scroll-animation.tsx`

Irish AI renders five grids (16 + 15 + 7 + 12 + 10 cards). Each grid listens to `window` scroll, `window` resize, and capturing `document` scroll, then `getBoundingClientRect` on its cards inside one frame. Reveal state only flips from false to true, so it does not re-render forever. The layout reads still happen on every scroll for the whole page.

Posters are eager `<img>` tags without `loading="lazy"`. Sampled JPEG size is 0.13 MB, so this is extra requests, not a decode storm.

**Proposed fix:** One `IntersectionObserver` for reveal. Add `loading="lazy"` and `decoding="async"` to cards below the first screen. Keep the tilt reveal.

**Regression risk:** Low.

### About word-weave and services tags read layout on raw scroll events

**File:** `src/components/Effects/SimpleWordWeave.tsx`

One `getBoundingClientRect` and a transform per word on every scroll event, for the whole page, with no passive flag and no frame throttle. It is unmounted with the listener removed. Same class of cost as the services tags, smaller DOM.

**Proposed fix:** Frame-throttle and skip when off screen. Keep the sine offsets.

**Regression risk:** Low.

### Homepage console logging in render

**File:** `src/app/page.tsx`

`console.log` runs in the render path (`Not initialized yet`, `Rendering with isLoading`). The production build still prints the first of these. Other debug logs sit on the showreel toggle, the about video, and the ghost section. They are not the incident. They add work if the homepage ever re-renders often, and they make real errors harder to see.

**Proposed fix:** Remove the logs. No behaviour change.

**Regression risk:** None.

### `use client` on the homepage pulls Three.js into the first load for every device

Measured production route table (`next build`, Next.js 14.0.0, successful, no type errors):

| Route | Route JS | First load JS |
| --- | --- | --- |
| `/` | 225 kB | 353 kB |
| `/video-editing` | 70.2 kB | 158 kB |
| `/video-editing/work/irish-ai-creative` | 4.82 kB | 99.8 kB |
| `/video-editing/work/two-blokes-trading` | 4.93 kB | 99.9 kB |
| `/project/[id]` | 2.18 kB | 127 kB |
| `/story` | 138 B | 88.1 kB |

Homepage manifest chunks include the 670 KB and 148 KB Three.js chunks. Video-editing pages do not. GSAP is on `/video-editing` (two chunks, 69.6 KB and 57.6 KB raw) and in the services lazy chunk on `/`. Shared first-load JS is 88 kB gzipped. Global CSS is 61.3 KB raw.

353 kB gzipped is not a pathological bundle. It is large enough to hurt a low-end phone at startup, and it includes WebGL code those phones discard after the mobile check.

**Proposed fix:** Dynamic-import the desktop canvas so the mobile homepage does not download Three.js. Keep the mobile hero markup as it is.

**Regression risk:** Medium around the loading placeholder. The canvas already waits on `canvasReady`. The dynamic import should use that same placeholder so desktop does not flash an empty hero.

### Video-editing cover PNGs are heavy sources

`public/video editing/video covers/` is 12 files, 51.84 MB total, several around 6 MB. The carousel uses `next/image` with `quality={85}`, so production requests should be resized. The optimizer still has to decode the source PNG on a cache miss. Worth recompressing the sources later. Not the homepage incident.

## Low Priority

- `src/hooks/useSmoothScroll.ts` implements a non-passive wheel hijack and a `requestAnimationFrame` scroll loop. Nothing imports it. The live hook, `useSmoothScrollBetter`, only sets `scroll-behavior`. Leave the live hook alone.
- `WordWeaveMeasured.tsx` is not imported. Its scroll handler logs every frame. Dead code, not a live cost.
- `providers.tsx` sets `isClient` and never reads it.
- `AudioContext` defines `registerPauseCallback` and never puts it on the context. Playback coordination still happens through `activeAudio` in the showreel, hero, and music player. The unused map is not the overlap bug.
- `public/webgl_spookie_pookie/Build/` contains several full Unity builds (`webgl dev`, `webgl 211`, `webgl-21-09-2025`, plus `.br` copies) besides `webgl-game.*`. Application code only requests `webgl-game.*`. Those other files are not downloaded in normal navigation. They are deploy weight. Do not delete them in a performance pass without a separate check that no external URL still points at them.
- `public/videos/theonlyrosh-showreel.mp4` (14.74 MB), `showreel-sample.mp4` (15.58 MB), and `rosh-placeholder.svg` (6.57 MB) are not referenced from `src/`.
- Navigation’s 1 Hz clock and its throttled scroll listener are fine.
- Google Analytics loads with `strategy="afterInteractive"`. It is not render-blocking.
- `framer-motion` on the showreel is doing real scroll-linked motion. Replacing it is a rewrite, not a fix.

## Things Investigated That Are NOT Problems

These looked suspicious and should be left alone unless a later measurement says otherwise.

- **Dozens of `<video>` elements decoding together.** They are not in the tree. Irish AI (60 cards), Two Blokes, and the video-editing carousel render posters. One player mounts on click. Work project videos mount only while that panel is hovered. This was the right place to look, and the implementation already avoids the failure mode.
- **Irish AI poster weight.** A sampled poster is 0.13 MB. Eager loading is wasteful and belongs in Medium, not in the “device feels slow” cause.
- **`useSmoothScrollBetter`.** It does not install a JavaScript scroll loop.
- **The music player.** It preloads a short SFX and does not start the music until a click. `preload="metadata"` on the music element.
- **Particle background lifecycle.** The loop is cancelled when the Unity modal closes. The cost is only while the modal is open (see High Priority).
- **GSAP on the video-editing carousel.** It is heavy code, and it is correctly limited to that route (158 kB first load). No evidence of a runaway ticker from reading it. Do not rewrite the carousel as part of this incident.
- **Custom cursor on touch devices.** It bails out when width is ≤ 768 after mount.
- **Bundle size as the primary incident.** 353 kB gzipped for `/` is worth trimming for phones. It does not explain a machine feeling slow after the page has been open for a minute. The always-on frame loops do.
- **Dense components.** `VideoEditing.tsx` and `RippleReveal.tsx` are long. Length is not the bug. The per-frame and per-move work inside them is.

## What differs by device

| Device | What it actually hits |
| --- | --- |
| Fast desktop, discrete GPU | Cursor main-thread work is hidden. Two WebGL scenes and a 15 MB video still run, but frames fit in budget. Reports of “it’s fine” come from here. |
| Average laptop, integrated GPU, often 4–8 cores | Full hero shader at up to 1.5× DPR, ghost bloom at up to 1.75× DPR, showreel decode, and `getComputedStyle` on every mouse move. `lowPowerMode` stays off because the CPU count is above 2. This is the “my laptop feels slow while the site is open” case. |
| Phone | No steady-state hero WebGL after the mobile flag flips, but Three.js was already downloaded and a canvas may have been created for a moment. A 14.7 MB autoplay video starts. The cursor is off. Opening a 50–150 MB portfolio file is the stall. |
| High-DPI display | Render targets and the ghost buffer scale with `devicePixelRatio` up to 1.5 and 1.75. A 14-inch high-DPI laptop pays the worst GPU tax. |
| `/story` only | Independent of the React costs. 55 MB file plus per-frame seeking. |

No Lighthouse, no live CPU profile, and no heap snapshot were captured in this pass. The production build, the route manifest, file sizes on disk, and `HEAD` requests against the R2 CDN are the measurements. The frame-loop and listener findings are from the code paths above, not from guessed timings.

## Baseline

Production `npm run build` on 23 September 2026:

- Next.js 14.0.0
- Compiled successfully, type check passed
- Warning: custom webpack config disables the webpack build worker
- Warning: `metadataBase` is unset (Open Graph URLs fall back to `http://localhost:3000` at build time)
- Homepage prerender executes the client page far enough to log `Not initialized yet, returning null`

First-load JS is the table in the Medium section. Uncompressed homepage chunks from `.next/app-build-manifest.json` sum to about 1.27 MB, dominated by the 670 KB Three.js chunk. Reported gzipped first load for `/` is 353 kB.

Asset baselines that matter at runtime:

- Showreel landscape 14.71 MB, portrait 20.20 MB, POV 16.96 MB, story 55.48 MB
- Hero portrait JPEG 3.01 MB
- Live Unity data 91.87 MB + wasm 21.22 MB, on demand
- Opened portfolio videos from 20 MB to 281 MB, on demand
- Case-study PNGs 30.83 MB and 32.42 MB
- Video-editing cover sources 51.84 MB across 12 PNGs, passed through `next/image`

Not measured, and not invented here: LCP, INP, CLS, TBT, long-task counts, FPS, or heap growth after repeated navigation. Those should be taken on a production `next start` against the homepage, the Irish AI page, and a back-and-forth between `/` and `/video-editing`, before and after any fix.

## Remediation order when work starts

The ghost lifecycle, the custom cursor, the hero WebGL runtime, and the homepage video lifecycle are done. See the remediation log. Adaptive quality, video encoding, and portfolio playback sizes are untouched.

When work continues, this order matches the incident rather than the size of the files:

1. Cancel the ghost animation frame, and do not start it off screen.
2. Stop the cursor from rendering through React and from reading computed style every move.
3. Stop rebuilding the hero texture on scroll, and pause the hero frame loop when it is off screen or the tab is hidden.
4. Do not decode the showreel or the POV until they are near the viewport.
5. Re-encode playback videos, and replace `.mov` / `.m4v` with files browsers can play.
6. Remove the global `will-change` attribute selectors.
7. Then services pinning, story scrubbing, case-study images, and fonts.

If a change would alter motion, copy, layout, or which video file plays, it should be written up before it lands. The cursor timing, the ripple, the ghost, the showreel scroll, and the services card offsets are part of the site and should survive the fixes.

## Remediation Log

### Fix 1 — Spectral Ghost WebGL Lifecycle

Critical issue 3 only. No other finding is resolved.

**Files changed**

- `src/components/Sections/Intro_Spooky-Pookie.tsx`

`SpookiePookieEntry.tsx` was inspected and left as it is. It still passes `showControls={!isOpen}` into the ghost section. The Unity modal, button, and game were not modified.

**Original problem**

The ghost loop called `requestAnimationFrame(animate)` and never stored or cancelled that id. Cleanup disposed the composer and renderer while the loop kept scheduling frames, including after the Unity modal toggled `showControls` and recreated the effect. The loop also started as soon as the section mounted, whether or not it was on screen.

**Exact fix**

The scene, shaders, bloom, fireflies, lights, mouse follow, and timing math are unchanged.

- The frame id is stored. Cleanup sets a disposed flag, cancels that frame, and only then disposes the WebGL resources. The loop does not schedule another frame after that flag is set.
- An `IntersectionObserver` with a 20% root margin watches the section. Off screen, the loop stops and the scene stays mounted, so scroll-away does not reset it. Near the viewport, the same loop resumes. `startLoop` refuses to run if a loop is already active.
- `visibilitychange` pauses the loop while the tab is hidden and resumes one loop only if the section is also near the viewport.
- Opening the Unity modal still runs the existing `showControls` teardown, so the ghost context is released while the game is up. Cleanup now cancels the frame, the preloader timers, the resize observer, the intersection observer, the mouse listener, the visibility listener, and the Tweakpane document listeners before dispose. Closing the modal creates one new scene, not a second one beside a leaked loop.
- Tweakpane is still created. If the effect is disposed while its import is in flight, the pane is disposed as soon as it is constructed and its document listeners are removed. `pane.dispose()` is guarded so it cannot run twice.

**Tweakpane**

It is a debug panel, not part of the visitor-facing section. The title is "Spectral Ghost", with sliders for reveal radius, opacity, follow, wobble, float, and eye glow. It is hidden in CSS below 768px, and on desktop the host is pushed down inside an `overflow: hidden` viewport, so it is likely clipped. It was left in place.

**Validation**

- `npx tsc --noEmit` passed.
- `npm run build` passed (Next.js 14.0.0, no type errors). Homepage first-load JS stayed 353 kB.
- Dev server compiled `/` with no compile error.
- Headless Chrome loaded the homepage and counted WebGL `drawElements` calls on the ghost canvas only:
  - Section mounted below the fold (`top` about 2522px): 1 canvas, 0 ghost draws while left there.
  - Scrolled into view: draws advanced (225 over the sample window).
  - Scrolled back to the top: draws stopped (0 over the next sample), and the canvas was still mounted (1), so the scene was paused rather than destroyed.
  - Scrolled back: draws advanced again (1845; bloom issues many draw calls per frame).
  - Opened and closed the Unity button three times: ghost canvas count was 1 after each close.
  - Navigated to `/video-editing`: ghost canvas count 0. Navigated back to `/`: ghost canvas count 1.

**Remaining concern**

Opening and closing Unity still rebuilds the ghost scene, because `showControls` is what mounts it. That is the previous structure. It no longer leaves the old loop running. A side-by-side pixel comparison of the ghost was not done. The draw path and scene setup were not edited. Headless Chrome also logged existing Unity startup errors (wasm MIME type, and a null `addEventListener` inside the Unity framework). Those come from the game build, not from this change, and the Unity files were not modified.

### Fix 2 — Custom Cursor Runtime

Critical issue 1 only. No other finding is resolved.

**Files changed**

- `src/components/UI/CustomCursor.tsx`

The homepage and video-editing layout still mount this component in the same places.

**Original problem**

Pointer and trail positions lived in React state. `mousemove` called `setMousePos`, and a `requestAnimationFrame` loop called `setTrailPos` on every frame, including after the pointer had stopped. The effect depended on `mousePos.x` and `mousePos.y`, so every move removed and re-added the listeners and restarted the loop. Colour sampling called `elementFromPoint` and `getComputedStyle` on every move. `left` and `top` were updated continuously, which forces layout.

**Implementation**

The dot, ring, sizes, z-index, hover classes, click scale, colour math, and trail constant `0.12` are unchanged.

- Pointer and trail coordinates are refs. Moving the pointer does not call `setState`.
- One animation loop writes `translate3d(x, y, 0) translate(-50%, -50%)` on the ring. The dot is placed the same way on the move event, so it still leads the ring. `left` and `top` stay `0`. Scale stays on the inner elements, so hover and click scale are not overwritten by the movement transform.
- The setup effect depends on `[]`. Listeners and the loop are created once and removed on unmount.
- Hover, click, and colour still use React state, and the setters run only when the value changes.
- Background colour is sampled only when `event.target` changes. The walk up the tree and the inversion math are the same. `getComputedStyle` reads the CSS `background-color`. It does not sample video pixels, gradient stops, or images, so staying on one element cannot see a new colour that the old per-move sampling would have missed. A new hit target still recomputes.
- Below or equal to 768px the effect returns before adding listeners or starting the loop. No user-agent check.

**Idle RAF**

Implemented. When the trail is within 0.5px of the pointer it snaps to that point and stops scheduling frames. The next move starts the same loop again. Until that threshold the step is still `(mouse - trail) * 0.12`.

**Validation**

- `npx tsc --noEmit` passed.
- A production `next build` was not run while the dev server was using `.next`. The dev server compiled `/`, `/video-editing`, and `/video-editing/work/irish-ai-creative` with no compile error. Each returned HTTP 200.
- Headless Chrome at 1440×900:
  - Both cursor layers mounted.
  - After a series of moves the dot transform was `translate3d(408px, 276px, 0px) translate(-50%, -50%)` with `left` and `top` still `0px`.
  - The ring reached the same point after the trail settled.
  - 25 mousemove events did not change the `mousemove` listener count.
  - `/video-editing` and the Irish AI page still mounted the cursor. Returning home still had one dot and one ring. The extra `z-[9999]` node on the video-editing page is the existing “See my work” button, not a second cursor.
  - At a 390×844 viewport the cursor nodes were absent.

**Remaining concern**

Colour still updates from CSS background colour, not from the pixels of a video or a gradient. That matches the previous sampler. A side-by-side feel check of the trail and the hover colour, by eye, was not done.

### Fix 3 — Hero WebGL Runtime

Critical issue 2 only. Adaptive quality and video loading are not resolved.

**Files changed**

- `src/components/Hero/Hero.tsx`
- `src/components/RippleReveal.tsx`

`Showreel.tsx` still dispatches `showreel-coverage-update` on every scroll-progress change. Navigation still listens to that event on its own. Neither file was modified.

**Original problem**

The desktop hero used `<Canvas frameloop="always">`. The section stays mounted and is only translated off screen, so the two fullscreen passes kept running for the whole homepage visit. Showreel coverage was stored in React state, and `textElements` / `iconElements` were new arrays on every Hero render, so that scroll recreated the 1200×600 text canvas. Each ripple frame also allocated `new Float32Array(80)`.

**Rendering lifecycle**

The canvas stays mounted. `frameloop` is `"always"` only while the hero section intersects the viewport (10% root margin) and `document.visibilityState === "visible"`. Otherwise it is `"never"`.

React Three Fiber’s own loop is the only loop. Switching to `"never"` makes the next frame cancel that `requestAnimationFrame`. Switching back to `"always"` goes through `setFrameloop`, and the fiber store subscription calls `invalidate`, which starts the same loop again if it is stopped. There is no second clock. Ripple refs, render targets, and the text texture stay on the mounted component. `setFrameloop` restarts the three.js clock, so the first resumed frame gets a normal delta instead of the time spent paused. That keeps `uTime` from jumping.

The 10% margin keeps drawing while the hero is still on screen, including during the 0.8s exit slide, and starts drawing again slightly before the section comes back.

**Texture and config**

The text and icon lists are module-level constants, so their identity does not change when Hero renders. Coverage is written onto the section element: same 0.8 exit threshold, same `translateY` up to `-120vh`, same 0.8s easing, and `pointer-events: none` above 0.2. Those values live in refs as well, so a later React render does not snap the transform back to zero. The text-texture effect still depends on `[p.text, p.textElements, p.iconElements]`. Ordinary coverage changes no longer render Hero, and a visibility render no longer changes those references, so the texture is not rebuilt.

**Allocation**

The composite uniform is still one `Float32Array(80)`, created with the material. Each frame clears that buffer and writes the live ripples into it. The shader still reads `uWaterRipples` / `uWaterRippleCount`. Three.js uploads that array with `uniform1fv` every composite pass, so keeping the same array does not freeze the ripples. The buffer belongs to that material instance.

**Pointer handling**

`getBoundingClientRect()` still runs on every pointer event. The hero’s exit is a 0.8s CSS transform, so the section’s box keeps moving after scroll events stop, and the pointer listener is on `window`. Caching the rectangle on resize or scroll would place ripples against a stale box during that slide. The read stays.

**Left unchanged on purpose**

- Adaptive quality. `hardwareConcurrency <= 2` still controls DPR, antialiasing, brush radius, and frame skipping.
- Video loading.
- Showreel scroll behaviour, aside from Hero no longer calling `setState` for coverage.
- Mobile detection. `isClient` and `isMobile` are set in the same effect, and the canvas renders only when `isClient && !isMobile`. React 18 batches those updates, so the desktop canvas is not mounted on a narrow viewport before the flag flips. No user-agent check was added. A larger responsive change was not made.
- The custom cursor, the spectral ghost, global CSS, and navigation.

**Validation**

- `npx tsc --noEmit` passed.
- A production `next build` was not run. A dev server is already using `.next`, and a build beside it replaces that output.
- Headless Chrome at 1440×900, after the loading screen:
  - One hero canvas. Moving the pointer and dispatching coverage from 0 to 0.75 left the 1200-wide text canvas count at 1.
  - At coverage 0.75 the transform was still `translateY(0vh)` and pointer events were `none`. At coverage 1 the transform was `translateY(-120vh)`, the canvas was still mounted, and hero draw calls over the next 500ms were 0.
  - Coverage 0 again: transform `translateY(0vh)`, pointer events `auto`, and hero draws resumed (102 in the next sample). The text canvas count stayed 1.
  - Forcing `visibilityState` to `hidden` stopped hero draws (0 over 500ms). Restoring `visible` resumed them (84), still on the same canvas.
  - `/video-editing` had 0 hero canvases. Returning to `/` had 1.
- No page errors were collected during that run.

**Remaining concern**

`preserveDrawingBuffer` is still false, so a paused canvas can be cleared by the browser. Pausing happens only once the section is outside the 10% margin, and drawing starts again before it re-enters, so that clear should not be on screen. A side-by-side look at the ripple, by eye, was not done. The brush, shader, and ripple parameters were not edited.

### Fix 4 — Homepage Video Lifecycle

Critical issue 4 only. Video encoding and portfolio playback sizes are not resolved.

**Files changed**

- `src/components/Sections/Showreel.tsx`
- `src/components/Sections/About.tsx`
- `src/components/Hero/Hero.tsx`

`src/app/page.tsx` was not changed. The loading screen still covers the mounted page with opacity for the same duration.

**Showreel, previously**

The desktop clip mounted with `preload="auto"`, `autoPlay`, and `play()` on mount, including a second attempt after one second. At rest the fixed overlay is translated off the right edge. A scroll listener paused it only after progress moved.

**Showreel, now**

There is still one video element. `autoPlay` is gone and `preload` is `metadata`. Playback uses the existing scroll progress, not a second observer.

The first positive progress sample is treated as the resting hero position. Playback starts once progress moves `0.02` past that, and no later than the existing entry at `0.2`, so the clip is already running while it is still off the right edge. It keeps playing through the entry, the hold, and the exit. It pauses when progress reaches the existing exit end. `currentTime` is not reset. Coming back calls `play()` on the same element.

A hidden tab pauses it. Showing the tab resumes only if scroll progress still says it should play. The loop and unexpected-pause restart run only while that same flag is set, so they do not fight an intentional pause.

**About POV, previously**

`POV.mp4` used `autoPlay` with no viewport check, so it could decode as soon as the About chunk mounted.

**About POV, now**

`autoPlay` is gone and `preload` is `metadata`. One `IntersectionObserver` with a `70%` root margin watches the About section. Entering that margin starts `play()`. Leaving it pauses. The margin is wide enough that a small scroll across the visible edge does not start and stop the clip, and `currentTime` is not reset. The mute choice is not changed.

**Page visibility**

Showreel, POV, and the mobile hero video pause while `document.visibilityState` is not `visible`. Each resumes only if its own viewport rule still wants playback. Listeners are removed on unmount.

**Preload**

Desktop showreel and POV use `preload="metadata"`. The mobile hero video stays `preload="auto"` with autoplay, because that clip is the visible hero, not an offscreen section. The file is still `theonlyrosh-showreel-fixed.mp4`.

**Audio and user intent**

`audioEnabled` is still the showreel sound choice, and it is not cleared when the viewport or the tab pauses the clip. While paused, the element is muted so sound does not continue. On resume, mute and the 0.8 volume fade are applied from `audioEnabled` again. `requestAudioPlay` / `releaseAudio` are unchanged. POV pause/resume does not write `muted`.

**Network**

Headless Chrome, cache disabled, 1440×900, after the loading screen, still at the top:

- Showreel was paused at `currentTime` 0, with its box to the right of the viewport.
- POV was paused at `currentTime` 0.
- Resource timing showed about 300-byte responses for both files, not the full payloads.
- POV’s full response, 15,686,843 bytes, was recorded later, when playback started as About approached and the video opacity was still 0.
- The showreel media request that followed `play()` did not report an encoded body length, so that file’s transferred size was not measured.

**Validation**

- `npx tsc --noEmit` passed.
- A production build was not run while a dev server was using `.next`.
- No page errors in the headless run.
- Scroll 0: showreel paused and off the right edge. By scroll 200 it was playing while its box was still right of the viewport. By scroll 800 it was centered, opacity 1, and time was advancing. At the end of the exit it paused and kept its time. Returning to the centered position resumed that time.
- Unmute left volume at 0.8. Scrolling away paused the element muted. Scrolling back resumed unmuted at 0.8, without restarting from 0.
- Hiding the tab paused the showreel. Showing it resumed, still muted when the user had not enabled sound.
- POV stayed paused through the showreel. It started once About was near and still faded out, and it was playing once that video had faded in. Scrolling back to the hero paused it and kept its time.
- At 390×844 the only playing video was the mobile hero clip (`preload="auto"`). POV stayed paused. The desktop showreel element was not mounted.

**Remaining concern**

The showreel’s full transfer size was not measured, so this does not claim a byte saving for that file. Encoding, `.mov` / `.m4v` playback, and the large portfolio files are unchanged. A side-by-side look at the entry, by eye, was not done. The measured timing shows the showreel was already playing before its box entered the viewport.
