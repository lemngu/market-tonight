import { readContent } from './content-store'
export type { HomeRoute, HomeStore, HomeMedia } from './content-schema'

export async function getHomeData() {
  const { published } = await readContent()
  const routes = published.routes.filter(route => route.isVisible)
  const ids = new Set(routes.map(route => route.id))
  return { site: published.site, routes, stores: published.stores.filter(store => store.isVisible && store.routeIds.some(id => ids.has(id))) }
}
