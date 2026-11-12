import Image from 'next/image'
import type { HomeMedia } from '@/lib/content-schema'
import { overviewPrograms } from '@/lib/festival-artwork'

export default function TimetableOverview({ image }: { image: HomeMedia }) {
  return <div className="timetable-overview">
    <a className="event-artwork schedule-desktop" href={image.url} target="_blank" rel="noopener noreferrer">
      <Image unoptimized src={image.url} alt={image.alt} width={image.width} height={image.height} />
    </a>
    <ol className="schedule-mobile overview-program-list">
      {overviewPrograms.map(program => <li className={'program-summary ' + program.color} key={program.title} data-program={program.color === 'dark' ? 'dj' : undefined}>
        <time aria-label={program.time}><span>{program.time.split('–')[0].split(':')[0]}<b className="time-colon">:</b>{program.time.split('–')[0].split(':')[1]}</span><span className="program-time-end">{program.time.split('–')[1].split(':')[0]}<b className="time-colon">:</b>{program.time.split('–')[1].split(':')[1]}</span></time><div><strong>{program.title}</strong><p>{program.place}</p></div>
      </li>)}
    </ol>
    <a className="artwork-original-link" href={image.url} target="_blank" rel="noopener noreferrer">전체 시간표 원본 보기 ↗</a>
  </div>
}
