# Ajmal Gholzad — Cinematic Portfolio

A single-page Next.js portfolio built with TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis, Three.js, React Three Fiber, and Drei.

## Setup

```bash
npm install
npm run dev
```

Use `npm run typecheck`, `npm run lint`, and `npm run build` before shipping.

## Content editing

All repeatable content and contact details live in `src/data/content.ts`. Product, venture, timeline, partner, route, and media objects are typed. Replace the placeholder email, LinkedIn URL, location, product URLs, and business details there.

## Asset replacement guide

| Asset | Current source | Final recommendation |
| --- | --- | --- |
| Hero | Remote city still | 2400×1600 AVIF/WebP, under 450 KB; or muted 1920×1080 WebM/MP4 with matching poster |
| Portrait | Remote executive placeholder | Ajmal portrait, 4:5, at least 1600 px, AVIF/WebP |
| Globe backdrop | Procedural WebGL | No replacement required; edit routes in `content.ts` |
| Manifesto | Remote space image | 2200×1400, low-contrast AVIF/WebP |
| Ventures | Four remote placeholders | 1600×1000 editorial imagery focused on mobile products, global distribution, commerce, and software |
| Products | Four remote screenshots | 1600×1000 UI screenshots, no sensitive information |
| Partners | Typographic placeholders | Confirmed monochrome SVG/PNG logos only; never imply unconfirmed partnerships |

Remote placeholders use Unsplash and are centralized or visibly marked in the relevant section. For a stable production launch, download approved final assets into `public/images`, `public/videos`, and `public/logos`, then update the data references. Add descriptive alt text whenever an image conveys meaning.

## Contact integration

`POST /api/contact` validates name, email, and message, then returns a demo confirmation without sending email. Before launch, replace the documented demo return in `src/app/api/contact/route.ts` with a provider call. Keep provider credentials server-only in `.env.local`, such as `RESEND_API_KEY`, and configure the same variable in Vercel. Never expose secret keys through `NEXT_PUBLIC_` variables.

## Performance and accessibility

The globe is client-only and pixel ratio is capped. Heavy imagery is lazy-loaded below the fold; the hero alone is prioritized. Continuous effects are reduced by system motion preferences. Navigation, forms, and section content remain usable without hover, WebGL, or animation.

## Deploy to Vercel

1. Push the project to a Git repository.
2. Import it in Vercel; the framework preset should detect Next.js automatically.
3. Keep the standard `npm run build` command and default output settings.
4. Add contact-provider environment variables after choosing a provider.
5. Assign the production domain and update `metadataBase` in `src/app/layout.tsx` if it differs from `https://ajmalgholzad.com`.
6. Verify the contact adapter, social metadata, remote images, keyboard navigation, reduced-motion mode, and all external links in production.

## Final launch checklist

- Replace every placeholder image, logo, product link, social URL, location, and email.
- Confirm all business claims and partnership permissions.
- Add the final scroll video only after it has been compressed and tested on mobile.
- Replace the demo contact adapter with a real transactional email provider.
- Generate a final 1200×630 Open Graph image using the approved brand photography.
