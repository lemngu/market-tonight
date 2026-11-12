import Image from 'next/image'
import type { HomeMedia } from '@/lib/content-schema'
import { overviewPrograms } from '@/lib/festival-artwork'

export default function TimetableOverview({ image }: { image: HomeMedia }) {
  return <div className="timetable-overview">
    <a className="event-artwork schedule-desktop" href={image.url} target="_blank" rel="noopener noreferrer">
      <Image unoptimized src={image.url} alt={image.alt} width={image.width} height={image.height} />
    </a>
    <ol className="schedule-mobile overview-program-list">
      {overviewPrograms.map(program => <li className={'program-summary ' + program.color} key={program.title}>
        <time>{program.time}</time><div><strong>{program.title}</strong><p>{program.place}</p></div>
      </li>)}
    </ol>
    <a className="artwork-original-link" href={image.url} target="_blank" rel="noopener noreferrer">전체 시간표 원본 보기 ↗</a>
  </div>
}
