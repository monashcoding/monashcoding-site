# Deploying monashcoding.com (Oracle Cloud + Dokploy)

The club's main site runs as a Docker container on an Oracle Cloud VM, fronted
by [Dokploy](https://dokploy.com). It moved off Vercel when we consolidated all
the club's apps onto the one box.

## Architecture: build off-box, run on-box

The Oracle VM is shared by several apps (monmap, mploy, monashcoding). A Docker
build peaks at 2–4 GB RAM and pegs the CPU; several of those racing on one box
is how you OOM production. So **we never build on the Oracle box**:

```
push to main ──▶ GitHub Actions (ubuntu-24.04-arm)
                   │  builds linux/arm64 image
                   ▼
                 GHCR: ghcr.io/monashcoding/monashcoding:latest
                   │  Dokploy pulls (webhook-triggered)
                   ▼
                 Oracle VM: `node server.js`  (~200–400 MB idle)
```

This is a **single-package Next.js 16 app** (App Router) with `output:
"standalone"`. Unlike monmap it has no workspace/monorepo layout, so the
Dockerfile is the simple shape. Content comes from **Sanity** (hosted CMS) and
the contact form sends via **Resend** (hosted) — there is **no database on the
Oracle box** for this app.

## Build-time vs runtime env

`next build` is **SSG** here: every page sets `revalidate = false` and
`events/[slug]` has `generateStaticParams()`, so the build **queries the Sanity
API**. That means:

- **Build-time (baked into the image, set as GitHub Variables → build-args):**
  the public Sanity vars. A Sanity project id + dataset are not secrets — they
  ship in the client bundle regardless — so they live in repo *Variables*, not
  Secrets.
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET` (default `production`)
  - `NEXT_PUBLIC_SANITY_API_VERSION` (default `2024-01-18`)
- **Runtime only (set in Dokploy, never build args):** the actual secrets, used
  only by API routes.
  - `RESEND_API_KEY` — contact form email (`/api/send`, `/api/event-reminder`)
  - `SANITY_WEBHOOK_SECRET` — verifies the on-demand revalidate webhook
    (`/api/revalidate`)

## One-time GitHub setup

1. **Repo Variables** (Settings → Secrets and variables → Actions → _Variables_).
   All browser-public, so Variables not Secrets:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = _(the Sanity project id)_
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `NEXT_PUBLIC_SANITY_API_VERSION` = `2024-01-18`
   The workflow has fallbacks for dataset + API version; set the project id or
   the build falls back to an empty id and fails (`sanity.config.ts` throws).
2. **Repo Secret**: `DOKPLOY_DEPLOY_WEBHOOK` = the deploy webhook URL Dokploy
   generates for the app (added after the Dokploy setup below). Until it exists,
   the workflow builds/pushes but skips the redeploy trigger.
3. **Make the GHCR package public** (or give Dokploy a read token) so the VM can
   pull without auth: after the first push, open the package at
   `github.com/orgs/monashcoding/packages` → Package settings → change
   visibility to Public. (The package is named `monashcoding`, not
   `monashcoding-site`.)

## One-time Dokploy setup

Dokploy panel: <https://dokploy.monashcoding.com>

1. **Create Application** → Provider: **Docker**.
   - Image: `ghcr.io/monashcoding/monashcoding:latest`
   - (If you kept the package private: add GHCR registry credentials — a GitHub
     PAT with `read:packages`.)
2. **Environment** (runtime vars):
   ```
   RESEND_API_KEY=<resend api key>
   SANITY_WEBHOOK_SECRET=<sanity webhook secret>
   NEXT_PUBLIC_SANITY_PROJECT_ID=<sanity project id>
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-18
   ```
   (The `NEXT_PUBLIC_*` are already baked into the image at build; setting them
   here too is harmless and keeps server-side reads consistent.)
3. **Port**: container listens on `3000`.
4. **Domains**: serve the apex as canonical, www as a redirect.
   - `monashcoding.com` → container port `3000` → enable HTTPS (Let's Encrypt).
   - `www.monashcoding.com` → 301 redirect to `monashcoding.com`.
5. **Deploy webhook**: copy the app's deploy webhook URL into the GitHub repo
   secret `DOKPLOY_DEPLOY_WEBHOOK` so each pushed image auto-redeploys.

## DNS + cutover (apex domain — do this carefully)

This is the club's highest-visibility site. **Verify the container is healthy
before repointing DNS** — don't swap a working site for a 502:

1. In Dokploy, watch the pull/restart logs until the container is up.
2. From the Oracle box, confirm the app answers on the apex Host header:
   ```
   curl -I -H "Host: monashcoding.com" http://localhost
   ```
   Expect a `200` (or a Next redirect), not a `502`/`connection refused`.
3. Only then touch DNS. On Cloudflare, the apex needs an **A record** (not a
   CNAME):
   - `A  @  <VM public IP>` — **grey-cloud (DNS-only) first** so Dokploy can
     complete the Let's Encrypt HTTP-01 challenge and issue the cert.
   - `CNAME  www  monashcoding.com`
   - Once the cert is issued and the site loads over HTTPS, **orange-cloud
     (proxy)** both records.

## Cutting the cord with Vercel

`vercel.json` (`{ "github": { "enabled": false, "silent": true } }`) stops
Vercel's GitHub integration from running deploy checks on push. For a complete
cut, also:

- **Disconnect the Git integration** in the Vercel dashboard (Project →
  Settings → Git → Disconnect).
- **Remove any required "Vercel" status check** in the GitHub branch-protection
  rule for `main`, or PRs will hang waiting on a check that no longer runs.

## Deploying a change

Just push to `main`. GitHub Actions builds + pushes the image, then hits the
Dokploy webhook, which pulls and restarts the container. Watch the run under the
repo's Actions tab; watch the pull/restart in Dokploy.

To deploy manually: Actions → **Build & publish image** → _Run workflow_, then
hit **Deploy** in Dokploy.

## Notes

- Only `NEXT_PUBLIC_*` are baked in at build time (client-bundle values) — hence
  build-args. The real secrets are runtime-only.
- The build reaches out to the Sanity API (SSG). If Sanity is unreachable or the
  project id is wrong, `next build` fails in CI — that's the fast feedback, not
  a broken deploy.
- Content edited in Sanity Studio (`/studio`) shows up via the on-demand
  revalidate webhook (`/api/revalidate`, guarded by `SANITY_WEBHOOK_SECRET`).
  Point the Sanity webhook at `https://monashcoding.com/api/revalidate`.
