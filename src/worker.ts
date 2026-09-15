/**
 * The Worker. Three things share one deployment:
 *
 *   /api/*     the Trokky API
 *   /studio/*  the Studio, served from static assets
 *   /*         the Astro site, rendered on request
 *
 * Astro's handler is wrapped rather than replaced: wrangler's `main` points here, and Astro's
 * own handler is imported for everything that is not Trokky's.
 */
import { handle } from '@astrojs/cloudflare/handler'
import { getTrokky, API_PATH, STUDIO_PATH, type TrokkyEnv } from './trokky/core'
import { seedSampleContent } from './trokky/seed'

export default {
  async fetch(request: Request, env: TrokkyEnv, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url)

    if (pathname === API_PATH || pathname.startsWith(`${API_PATH}/`)) {
      const { core, api } = await getTrokky(env)
      const response = await api(request)

      // The first administrator has just claimed the instance: give them something to look at.
      // Runs after the response so the claim itself is never slowed or failed by seeding.
      if (request.method === 'POST' && pathname === `${API_PATH}/auth/claim` && response.ok) {
        ctx.waitUntil(seedSampleContent(core, env.ASSETS, new URL(request.url).origin).catch(error => console.error('seed failed', error)))
      }
      return response
    }

    if (pathname === STUDIO_PATH || pathname.startsWith(`${STUDIO_PATH}/`)) {
      const { studio } = await getTrokky(env)
      return studio(request)
    }

    return handle(request, env as unknown as Env, ctx)
  },
} satisfies ExportedHandler<TrokkyEnv>
