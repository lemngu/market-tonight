import Image from 'next/image'
import type { SiteCopy } from '@/lib/content-schema'
import SiteFrame from './SiteFrame'

export default function FestivalExperience({site}:{site:SiteCopy}) {
  const copy = site.festivalPage
  return <SiteFrame site={site}><div className="detail-page-inner festival-detail-page"><a className="detail-breadcrumb" href="/">홈 / 행사 안내</a><header className="detail-page-heading"><span>{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.description}</p><div className="event-quick-facts"><span>{copy.date}</span><span>{copy.schedule}</span><span>{copy.location}</span></div></header>
    {copy.timetable && <section className="timetable-section" aria-labelledby="timetable-title"><div className="detail-section-heading"><div><span>01 / TIME TABLE</span><h2 id="timetable-title">{copy.timetableTitle}</h2></div><a href={copy.timetable?.url} target="_blank" rel="noreferrer">원본 크게 보기 ↗</a></div><a className="timetable-art" href={copy.timetable?.url} target="_blank" rel="noreferrer"><Image unoptimized priority src={copy.timetable?.url || "/assets/event/timetable.svg"} alt={copy.timetable?.alt || "행사 시간표"} width={copy.timetable?.width || 2333} height={copy.timetable?.height || 1391} /></a></section>}
    <section className="event-programs" aria-labelledby="program-title"><div className="detail-section-heading"><div><span>02 / PROGRAMS</span><h2 id="program-title">{copy.programTitle}</h2></div></div><div className="event-program-grid">{copy.programs.map(program => <article className={'event-program ' + program.color} key={program.title + program.time}><span className="event-program-time">{program.time}</span><h3>{program.title}</h3><p>{program.description}</p><span className="event-program-place">↗ {program.place}</span></article>)}</div></section>
    <aside className="event-linked"><span>{copy.linkedEyebrow}</span><h2>{copy.linkedTitle}</h2>{copy.linkedDescription && <p className="event-linked-description">{copy.linkedDescription}</p>}<p>{copy.linkedSchedule}</p><p>{copy.linkedLocation}</p>{copy.linkedNote && <p className="event-linked-note">{copy.linkedNote}</p>}</aside><p className="detail-page-note">{copy.note}</p><a className="detail-back-link" href="/map">행사 장소 지도 보기 →</a>
  </div></SiteFrame>
}
