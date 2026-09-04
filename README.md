# Kyle Stringham — services page

A single page: what I do, what it costs, how it works, and (soon) a short inquiry form.

## Running it

```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Next.js App Router. Server components throughout — the page is fully static and
works with JavaScript disabled. The form (not yet built) will be the only client
component.

## Before this goes live

`CONTACT_EMAIL` at the top of `app/page.tsx` is still `you@example.com`. It feeds
both the contact button and the mailto link.

## Images

The hero photograph lives at `app/hero.png` and is rendered through
`next/image` with a static import, so Next serves resized WebP: the 2.4 MB
source is delivered as roughly 50 KB at phone widths and 170 KB at desktop
widths. Keep the full-resolution file as the master — do not hand-compress it
and commit the result over the top.

The hero behaves differently by viewport, on purpose. On desktop the photo is
full-bleed with the copy over its left side, held legible by a scrim. On a phone
the viewport is far taller than it is wide, so `cover` maps the whole image
height onto the whole hero and the moon ends up behind the copy no matter how
`object-position` is shifted — so below 64rem the photo gets its own band at
close to native aspect and the copy sits on plain cream.

The two remaining slots, `timeline` and `aside`, still render tinted panels.
Name files in `PHOTOS` at the top of `app/page.tsx` to fill them:

```ts
const PHOTOS = {
  timeline: "/timeline.jpg", // roughly square-to-portrait
  aside:    "/aside.jpg",    // small, 4:3
};
```

Those go in `/public`. Photos must be ones you own or have the rights to use.

## Accessibility notes

Contrast is verified numerically, not by eye, and three colors are deliberately
not used as the palette originally described them:

- `--smoke` (#787C83) is 4.19:1 on white and 3.95:1 on `--paper-warm` — below AA,
  so it is not used for text anywhere, including placeholders when the form is
  built. Use `--slate` (6.09:1 on cream) instead.
- `--gold-light` (#C2A072) is 2.45:1 on white. Inline link underlines use
  `--gold` (3.60:1), which is the minimum for a non-text affordance.
- `--gold` on `--cream` is 3.09:1, which only clears AA as *large* text. The
  `01/02/03` tier numerals are therefore pinned at 24px minimum.

Text over photography is measured against the rendered pixels, not assumed. The
worst backdrop pixel behind each hero element is checked at 1440px and at 375px
and 414px; the hero edge marks needed their own scrim before white cleared 4.5:1
against the dark gold at the right edge.

Hairlines derive from `--slate` at 22%/34% rather than invented hex values.

## Build order

1. ~~The page — all blocks, static, no form.~~ ✅
2. The form — working, ugly.
3. Wire Formspree, send a real test submission.
4. Styling pass.
5. Mobile pass on a real device.
