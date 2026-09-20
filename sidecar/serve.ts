import { fileURLToPath } from 'node:url'

import { createHandler } from './core'
import { makeReadJournal, makeWriteJournal, requireVault } from './obsidian'
import { createServeHandler } from './serve-handler'

const PORT = Number(process.env.PORT ?? 5175)
const VAULT = requireVault()
const DIST_DIR = fileURLToPath(new URL('../dist', import.meta.url))

Bun.serve({
  port: PORT,
  fetch: createServeHandler({
    apiHandler: createHandler({
      vault: VAULT,
      readJournal: makeReadJournal(VAULT),
      writeJournal: makeWriteJournal(VAULT),
    }),
    distDir: DIST_DIR,
  }),
})

console.log(
  `logseq-workout serving ${DIST_DIR} on http://0.0.0.0:${PORT} (vault=${VAULT})`,
)
