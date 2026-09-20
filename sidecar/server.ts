import { createHandler } from './core'
import { makeReadJournal, makeWriteJournal, requireVault } from './obsidian'

const PORT = Number(process.env.SIDECAR_PORT ?? 12316)
const VAULT = requireVault()

Bun.serve({
  port: PORT,
  fetch: createHandler({
    vault: VAULT,
    readJournal: makeReadJournal(VAULT),
    writeJournal: makeWriteJournal(VAULT),
  }),
})

console.log(
  `obsidian sidecar listening on http://127.0.0.1:${PORT} (vault=${VAULT})`,
)
