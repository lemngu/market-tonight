import { readContent } from './content-store'
export type { HomeRoute, HomeStore, HomeMedia } from './content-schema'

export async function getHomeData() {
  const { published } = await readContent()
  return { site: published.site }
}
