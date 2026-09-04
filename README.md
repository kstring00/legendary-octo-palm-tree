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

Two placeholders need real values.

**1. Email address.** `CONTACT_EMAIL` at the top of `app/page.tsx` is
`you@example.com`. It feeds both the button and the mailto link.

**2. Photographs.** No images are committed — nothing here is licensed to us.
Each image slot renders a tinted panel until you supply your own. To turn them
on, drop files into `/public` and name them in `PHOTOS` at the top of
`app/page.tsx`:

```ts
const PHOTOS = {
  hero:     "/hero.jpg",      // wide, light/misty — text sits over its left half
  timeline: "/timeline.jpg",  // roughly square-to-portrait
  aside:    "/aside.jpg",     // small, 4:3
};
```

The hero has a fixed light scrim over its left side and the overlay labels have
a bottom scrim, so the text stays readable whatever photo you use. Photos must
be ones you own or have the rights to use.

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

Hairlines derive from `--slate` at 22%/34% rather than invented hex values.

## Build order

1. ~~The page — all blocks, static, no form.~~ ✅
2. The form — working, ugly.
3. Wire Formspree, send a real test submission.
4. Styling pass.
5. Mobile pass on a real device.
