import { getHomeData } from '@/lib/home-data'
import MapExperience from '../MapExperience'
export const dynamic='force-dynamic'
export const metadata={title:'시장 지도 | Market Tonight'}
export default async function Page(){const {site}=await getHomeData();return <MapExperience site={site}/>}
