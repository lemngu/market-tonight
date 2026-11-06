import { getHomeData } from '@/lib/home-data'
import FestivalExperience from '../FestivalExperience'
export const dynamic='force-dynamic'
export const metadata={title:'행사 안내 | Market Tonight'}
export default async function Page(){const {site}=await getHomeData();return <FestivalExperience site={site}/>}
