import { join, normalize, resolve, sep } from 'node:path'

const API_PREFIX = '/logseq-cli'

export interface ServeHandlerDeps {
  apiHandler: (req: Request) => Promise<Response>
  distDir: string
}

function cacheControlFor(pathname: string): string | null {
  if (pathname.startsWith('/assets/')) {
    return 'public, max-age=31536000, immutable'
  }
  if (
    pathname === '/' ||
    pathname === '/index.html' ||
    pathname === '/sw.js' ||
    pathname === '/registerSW.js' ||
    pathname === '/manifest.webmanifest'
  ) {
    return 'no-cache'
  }
  return null
}

export function createServeHandler({ apiHandler, distDir }: ServeHandlerDeps) {
  const root = resolve(distDir)
  const indexFile = join(root, 'index.html')

  return async function handle(req: Request): Promise<Response> {
    const url = new URL(req.url)

    if (
      url.pathname === API_PREFIX ||
      url.pathname.startsWith(`${API_PREFIX}/`)
    ) {
      const stripped = url.pathname.slice(API_PREFIX.length) || '/'
      url.pathname = stripped
      return apiHandler(new Request(url.toString(), req))
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return new Response('not found', { status: 404 })
    }

    const requestPath = normalize(decodeURIComponent(url.pathname))
    const candidate = resolve(join(root, requestPath))
    if (candidate === root || candidate.startsWith(root + sep)) {
      const file = Bun.file(candidate === root ? indexFile : candidate)
      if (await file.exists()) {
        const cacheControl = cacheControlFor(url.pathname)
        return new Response(file, {
          headers: cacheControl ? { 'Cache-Control': cacheControl } : undefined,
        })
      }
    }

    return new Response(Bun.file(indexFile), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  }
}
