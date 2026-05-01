# PDF.js Mobile Terms Viewer Design

## Goal

Replace native PDF `iframe` embed on terms page with PDF.js loaded from CDN so mobile phones:

- show all PDF pages
- fit each page to available width
- allow reliable vertical scrolling
- support scroll-to-bottom gating before `Accept` or `Reject`

## Current Problem

Current implementation embeds `tc/normalTC.pdf` in an `iframe`.

On real mobile browsers, native PDF viewers are inconsistent:

- some show only first page inside `iframe`
- some ignore width-fit parameters
- some allow horizontal overflow
- scroll tracking inside embedded PDF is unreliable

Laptop devtools mobile emulation does not match real mobile PDF viewer behavior.

## Chosen Approach

Use PDF.js from CDN and render all PDF pages into canvases inside existing terms document area.

### Why

- one code path for desktop and mobile
- GitHub Pages compatible
- no build step
- width scaling controlled by page code, not browser PDF plugin
- scroll tracking can use outer container directly

## Implementation Design

### HTML

In `index.html`:

- remove `iframe#termsDocumentFrame`
- add `div#termsDocumentViewer` inside `#termsContainer`
- add status element for loading and error states inside terms area
- load PDF.js from CDN before `script.js`

### JavaScript

In `script.js`:

- remove `iframe`-specific logic
- load PDF document from `tc/normalTC.pdf` through PDF.js
- render every page in order into its own `canvas`
- scale each page so canvas width matches available viewer width
- append rendered pages vertically
- on resize, re-render using current container width
- use `termsContainer` scroll position for bottom detection

### Error Handling

If PDF fails to load:

- show clean error message in terms area
- keep name input disabled
- keep `Accept` and `Reject` disabled

### Scroll Gating

Controls unlock only when:

- PDF rendered successfully
- user scrolled `termsContainer` to bottom

If content height does not exceed container height, controls may unlock immediately after render.

## Styling

In `styles.css`:

- make viewer area full width
- stack pages vertically with consistent spacing
- ensure each canvas uses `display: block`
- ensure each canvas never exceeds container width
- keep current blurred card layout

## Testing

Manual checks:

- desktop: all pages render in order
- real phone: no horizontal scrolling in PDF area
- real phone: multiple pages visible by vertical scroll
- resize/orientation change: pages re-fit width
- failed PDF path: clean error, controls remain disabled

## Scope

In scope:

- terms page PDF rendering change
- mobile-safe width fitting
- reliable scroll gating

Out of scope:

- search inside PDF
- zoom controls
- page thumbnails
- download/print controls
