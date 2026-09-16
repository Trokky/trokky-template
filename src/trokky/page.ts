/**
 * The one line every page starts with: Trokky, from the Worker's bindings.
 *
 * Astro 6+ dropped `Astro.locals.runtime.env`; bindings come from the `cloudflare:workers`
 * module, which is importable anywhere in the Worker. The `astro` argument is unused here and
 * present so pages read the same on both runtimes.
 */
import type { AstroGlobal } from 'astro'
import { env } from 'cloudflare:workers'
import { getTrokky, type TrokkyEnv } from './core'
import { site, type Site } from './site'

export async function load(_astro: AstroGlobal): Promise<Site> {
  const { core } = await getTrokky(env as unknown as TrokkyEnv)
  return site(core)
}
