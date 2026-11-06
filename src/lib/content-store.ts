import 'server-only'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { contentSchema, type Content } from './content-schema'
import { defaultContent } from './default-content'

export const dataDirectory = process.env.MARKET_DATA_DIRECTORY || path.join(process.cwd(), '.local-data')
const stateFile = path.join(dataDirectory, 'content.json')
export type ContentState = { revision: number; draft: Content; published: Content; updatedAt: string | null; publishedAt: string | null }
const initialState = (): ContentState => ({ revision: 0, draft: structuredClone(defaultContent), published: structuredClone(defaultContent), updatedAt: null, publishedAt: null })
export async function readContent(): Promise<ContentState> {
  try {
    const state = JSON.parse(await readFile(stateFile, 'utf8')) as ContentState
    return { ...state, draft: contentSchema.parse(state.draft), published: contentSchema.parse(state.published) }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return initialState()
    throw error
  }
}
// Serialize writes across HMR/module reloads in the single local server process.
const globalState = globalThis as typeof globalThis & { marketWriteQueue?: Promise<unknown> }
export function saveContent(content: Content, revision: number, publish: boolean): Promise<ContentState> {
  const result = (globalState.marketWriteQueue ?? Promise.resolve()).then(async () => {
    const current = await readContent()
    if (current.revision !== revision) throw new Error('CONFLICT')
    const next: ContentState = { ...current, revision: revision + 1, draft: content, published: publish ? structuredClone(content) : current.published, updatedAt: new Date().toISOString(), publishedAt: publish ? new Date().toISOString() : current.publishedAt }
    await mkdir(dataDirectory, { recursive: true })
    if (current.revision > 0) {
      const history = path.join(dataDirectory, 'history')
      await mkdir(history, { recursive: true })
      await writeFile(path.join(history, `revision-${current.revision}.json`), JSON.stringify(current), { flag: 'wx' }).catch((error: NodeJS.ErrnoException) => { if (error.code !== 'EEXIST') throw error })
    }
    const temporaryFile = path.join(dataDirectory, `${randomUUID()}.tmp`)
    await writeFile(temporaryFile, JSON.stringify(next, null, 2), { encoding: 'utf8', mode: 0o600 })
    await rename(temporaryFile, stateFile)
    return next
  })
  globalState.marketWriteQueue = result.catch(() => undefined)
  return result
}

