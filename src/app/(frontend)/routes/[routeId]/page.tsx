import { notFound } from 'next/navigation'
import { getHomeData } from '@/lib/home-data'
import HomeExperience from '../../HomeExperience'
export const dynamic='force-dynamic'
export default async function RoutePage({params}:{params:Promise<{routeId:string}>}){const {routeId}=await params;const data=await getHomeData();if(!data.routes.some(route=>route.id===routeId))notFound();return <HomeExperience {...data} publicFeed detailMode initialRouteID={routeId} showDemo={process.env.NODE_ENV==='development'}/>}
