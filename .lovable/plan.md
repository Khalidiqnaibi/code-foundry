## Goal
Fix two broken visualizations on `/visual` and resolve responsiveness issues across the app.

## 1. Visual Learning fixes (`src/routes/visual.tsx`)

**Recursion Tree (`RecursionViz`)**
- Problem: at `fib(5)` the recursive flex layout makes child subtrees overlap and collide; connector lines are just a single vertical bar and don't actually connect parent → children.
- Fix: rewrite as an SVG-based tree.
  - Pre-compute node positions with a simple layout pass (assign x by in-order leaf index, y by depth, with min horizontal spacing).
  - Render straight/curved SVG lines from each parent to its two children so branching is visually clear.
  - Render circular nodes with `fib(n)` labels; color base cases (`n<=1`) green, recursive nodes blue.
  - Wrap SVG in a horizontally scrollable container with `viewBox` so it scales on mobile.
  - Add a small `n` selector (3/4/5/6) so users can explore.

**Memory Diagram (`MemoryViz`)**
- Problem: the arrow is positioned with hardcoded `left: 47%, top: 78px` percentages and only shows on `md+`. It misaligns on resize and disappears on mobile.
- Fix: use a measured-overlay approach.
  - Give the stack pointer row and the heap object `ref`s; compute their bounding boxes after mount and on resize (`ResizeObserver`).
  - Draw a single SVG overlay sized to the grid container; render the arrow path from the right edge of the pointer row to the left edge of the heap card, with an arrowhead marker.
  - Stack stacks vertically on mobile; arrow recomputes and points downward instead of right when layout wraps.

## 2. Responsiveness pass

**AppShell (`src/components/AppShell.tsx`)**
- Bug: the content wrapper has `animate={{ paddingLeft: sidebarWidth }}` but is overridden by `style={{ paddingLeft: 0 }}`, so on desktop the fixed sidebar overlaps page content.
- Fix: remove the inline `style` override; apply `paddingLeft` only at `md+` (use `md:` class or conditional style guarded by a media query) so mobile (where the sidebar is a drawer) keeps `paddingLeft: 0`.
- Topbar: allow the search input to shrink (`min-w-0`, hide on very small screens or shrink width); ensure the streak badge and avatar don't wrap.

**Lab page (`src/routes/lab.tsx`)**
- The fixed `h-[calc(100vh-3.5rem)]` + nested `max-h-[55%]` panel breaks on short mobile viewports. Switch to `min-h` on mobile and only enforce the fixed viewport height at `lg+` where the split-screen layout activates. Stack panels vertically with natural height on mobile.

**Visual page tabs**
- Tab row already wraps; verify each viz card scales: sort chart already responsive; recursion + memory get explicit overflow handling above; git graph SVG already uses `viewBox` but ensure container is `overflow-x-auto`.

**Dashboard / Courses / Community / Index**
- Spot-check grid breakpoints and horizontal overflow at 360px. Adjust any `min-w` or fixed widths found during implementation (no rewrites — only targeted fixes).

## 3. Verification
- Run dev build; load `/visual` and switch tabs to confirm recursion tree branches render cleanly and memory arrow tracks both layouts.
- Resize preview to mobile (375px) and desktop (1280px); confirm no horizontal scroll on any route and sidebar/content alignment is correct on desktop.

## Files touched
- `src/routes/visual.tsx` (RecursionViz, MemoryViz)
- `src/components/AppShell.tsx` (padding bug, topbar shrink)
- `src/routes/lab.tsx` (responsive heights)
- Minor tweaks to other route files only if responsive issues are found during QA.
