// BUNDLES THE WORKER WITH esbuild AND CALLS app.fetch() IN NODE: LINK AND SEO CHECKS NEED NO SERVER AND NO NETWORK.
import { build } from 'esbuild'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

export async function loadWorker() {
  const res = await build({ entryPoints: [join(root, 'src/index.ts')], bundle: true, format: 'esm', platform: 'neutral', mainFields: ['module', 'main'], write: false, jsx: 'automatic', jsxImportSource: 'hono/jsx', logLevel: 'error' })
  const dir = mkdtempSync(join(tmpdir(), 'bdf-'))
  const file = join(dir, 'worker.mjs')
  writeFileSync(file, res.outputFiles[0].text)
  const mod = await import(pathToFileURL(file).href)
  return {
    fetch: (url, init, env = {}) => mod.default.fetch(new Request(url, init), { ENVIRONMENT: 'production', SITE_ORIGIN: 'https://buydummyflights.com', INDEXING: 'on', ...env }),
  }
}
export { root }
