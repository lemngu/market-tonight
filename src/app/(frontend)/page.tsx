import HomeExperience from './HomeExperience'
import { getHomeData } from '@/lib/home-data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const data = await getHomeData()
  return <HomeExperience {...data} showDemo={process.env.NODE_ENV === 'development'} />
}
