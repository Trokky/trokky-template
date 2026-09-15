/**
 * One Trokky per isolate.
 *
 * Bindings only exist inside `fetch`, so the core is built on the first request and kept for
 * the life of the isolate. Building it per request would re-check the D1 schema every time.
 */
import { TrokkyCore } from '@trokky/trokky'
import { createFetchHandler, type FetchHandler } from '@trokky/trokky/workers'
import { CloudflareD1Adapter } from '@trokky/trokky/adapters/cloudflare-d1'
import { CloudflareR2Adapter } from '@trokky/trokky/adapters/cloudflare-r2'
import { createStudioFetchHandler } from '@trokky/studio/workers'
import { schemas } from './schemas'
import { structure } from './structure'

export interface TrokkyEnv {
  DB: D1Database
  MEDIA: R2Bucket
  IMAGES: ImagesBinding
  ASSETS: { fetch(request: Request): Promise<Response> }
  TROKKY_JWT_SECRET?: string
  TROKKY_CLAIM_SECRET?: string
}

export const API_PATH = '/api'
export const STUDIO_PATH = '/studio'

export interface Trokky {
  core: TrokkyCore
  api: FetchHandler
  studio: (request: Request) => Promise<Response>
}

let instance: Promise<Trokky> | undefined

export function getTrokky(env: TrokkyEnv): Promise<Trokky> {
  instance ??= build(env)
  return instance
}

async function build(env: TrokkyEnv): Promise<Trokky> {
  const core = new TrokkyCore(
    {
      // Required by the type even though the adapters below are passed directly.
      storage: { adapter: 'cloudflare-d1', options: {} },
      schemas: schemas as never,
      media: {
        imageProcessor: 'cloudflare-images',
        imageProcessorOptions: { images: env.IMAGES },
        imageVariants: [
          { name: 'thumbnail', width: 480, height: 320, format: 'webp', quality: 80, fit: 'cover' },
          { name: 'large', width: 1600, height: 1000, format: 'webp', quality: 85, fit: 'inside' },
        ],
      },
    },
    {
      data: new CloudflareD1Adapter({ database: env.DB }),
      media: new CloudflareR2Adapter({ bucket: env.MEDIA }),
    },
    {
      jwtSecret: env.TROKKY_JWT_SECRET,
      claimSecret: env.TROKKY_CLAIM_SECRET,
    },
  )
  // Creates the image processor; nothing serves images without it.
  await core.init()

  const api = createFetchHandler({ core, basePath: API_PATH, structureConfig: structure })
  const studio = createStudioFetchHandler({ basePath: STUDIO_PATH, apiPath: API_PATH, assets: env.ASSETS })
  return { core, api, studio }
}
