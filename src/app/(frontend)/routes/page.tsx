import { getHomeData } from '@/lib/home-data'
import HomeExperience from '../HomeExperience'
export const dynamic='force-dynamic'
export const metadata={title:'미식루트 | Market Tonight'}
export default async function RoutesPage(){const data=await getHomeData();return <HomeExperience {...data} publicFeed detailMode showDemo={process.env.NODE_ENV==='development'}/>}
