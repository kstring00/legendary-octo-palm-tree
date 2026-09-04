# Kyle Stringham — services page

A single static page: what I do, what it costs, how it works, and (soon) a short inquiry form.

## Running it

```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Next.js App Router. Server components throughout — the page is fully static and
works with JavaScript disabled. The form (not yet built) will be the only client
component.

## Build order

1. ~~The page — five blocks, static, no form.~~ ✅ Deploy this.
2. The form — working, ugly.
3. Wire Formspree, send a real test submission.
4. Styling pass.
5. Mobile pass on a real device.
