import Image from 'next/image'
import type { SiteCopy } from '@/lib/content-schema'
import { djPerformers, festivalArtwork, schoolPerformers } from '@/lib/festival-artwork'
import SiteFrame from './SiteFrame'
import TimetableOverview from './TimetableOverview'

export default function FestivalExperience({ site }: { site: SiteCopy }) {
  const copy = site.festivalPage
  const speaker = copy.programs.find(program => program.title.includes('말왕'))
  const school = copy.programs.find(program => program.title.includes('버스킹'))
  const dj = copy.programs.find(program => program.title.includes('DJ'))
  const sections = [
    ['overview', '전체 시간표'], ['malwang', '말왕 토크쇼'], ['school-popup', '스쿨뮤직 팝업부스'], ['school-music', '스쿨뮤직 버스킹'],
    ['dj-rave', 'DJ RAVE'], ['rice-sale', '전통시장 가는 날'],
  ]
  const speakerImage = copy.speakerImage || festivalArtwork.speaker
  const schoolImage = copy.schoolTimetable || festivalArtwork.school
  const djImage = copy.djTimetable || festivalArtwork.dj
  return <SiteFrame site={site}><div className="detail-page-inner festival-detail-page">
    <header className="detail-page-heading"><span>{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.description}</p>
      <div className="event-quick-facts"><span>{copy.date}</span><span>{copy.schedule}</span><span>{copy.location}</span></div>
    </header>
    <nav className="festival-section-tabs" aria-label="행사 안내 바로가기">
      {sections.map(([id, title]) => <a key={id} href={'#' + id}>{title}</a>)}
    </nav>
    <section className="festival-program-section" id="overview" aria-labelledby="overview-title">
      <div className="program-section-heading"><span>01 / TIME TABLE</span><h2 id="overview-title">전체 타임테이블 안내</h2></div>
      <TimetableOverview image={copy.timetable || festivalArtwork.overview} />
    </section>
    <section className="festival-program-section" id="malwang" aria-labelledby="malwang-title">
      <div className="program-section-heading"><span>02 / SPECIAL GUEST</span><h2 id="malwang-title">말왕 토크쇼·사인회</h2></div>
      <div className="guest-program-layout">
        <div className="program-introduction"><p className="program-time">{speaker?.time || '16:00–17:30'}</p>
          <p className="program-place">{speaker?.place || '구월모래내시장 서문 일원'}</p>
          <p>{speaker?.description || '유튜버 말왕과 청년의 도전과 일상 이야기를 나누는 소통 무대, 토크쇼와 사인회.'}</p>
        </div>
        <div className="guest-mobile-details"><dl><div><dt>일시</dt><dd>11월 13일 · {speaker?.time || '16:00–17:30'}</dd></div><div><dt>장소</dt><dd>{speaker?.place || '구월모래내시장 서문 일원'}</dd></div><div><dt>프로그램</dt><dd>청년의 도전과 일상 이야기를 나누는 토크쇼 &amp; 사인회</dd></div></dl></div>
        <a className="event-artwork" href={speakerImage.url} target="_blank" rel="noopener noreferrer">
          <Image unoptimized src={speakerImage.url} alt={speakerImage.alt} width={speakerImage.width} height={speakerImage.height} />
        </a>
      </div>
    </section>
    <section className="festival-program-section" id="school-popup" aria-labelledby="school-popup-title">
      <div className="program-section-heading"><span>03 / SCHOOL MUSIC POP-UP</span><h2 id="school-popup-title">팝업부스 운영</h2><p className="program-subtitle">스쿨뮤직</p></div>
      <div className="school-popup-info"><p className="school-popup-time">14:00–21:00</p><dl><div><dt>장소</dt><dd>{school?.place || '구월모래내시장 서문 일원'}</dd></div><div><dt>안내</dt><dd>스쿨뮤직 버스킹과 같은 장소에서 진행합니다.</dd></div></dl></div>
    </section>
    <section className="festival-program-section" id="school-music" aria-labelledby="school-title">
      <div className="program-section-heading"><span>04 / SCHOOL MUSIC BUSKING</span><h2 id="school-title">버스킹 안내</h2><p className="program-subtitle">스쿨뮤직</p></div>
      <div className="program-facts"><p><strong>버스킹</strong> {school?.time || '17:30–21:00'}</p><p>{school?.place || '구월모래내시장 서문 일원'}</p></div>
      <a className="event-artwork schedule-desktop" href={schoolImage.url} target="_blank" rel="noopener noreferrer">
        <Image unoptimized src={schoolImage.url} alt={schoolImage.alt} width={schoolImage.width} height={schoolImage.height} />
      </a>
      <ol className="schedule-mobile performer-list">{schoolPerformers.map(performer => <li key={performer.time}><time>{performer.time}</time><strong>{performer.name}</strong></li>)}</ol>
      <a className="artwork-original-link" href={schoolImage.url} target="_blank" rel="noopener noreferrer">스쿨뮤직 시간표 원본 보기 ↗</a>
    </section>
    <section className="festival-program-section" id="dj-rave" aria-labelledby="dj-title">
      <div className="program-section-heading"><span>05 / DJ RAVE</span><h2 id="dj-title">DJ 타임테이블</h2></div>
      <div className="program-facts"><p><strong>{dj?.time || '17:00–21:00'}</strong></p><p>{dj?.place || '구월시장 포차거리'}</p><p>음악과 드로잉을 함께 즐기는 DJ RAVE &amp; Doodle 테이블</p></div>
      <a className="event-artwork schedule-desktop dj-artwork" href={djImage.url} target="_blank" rel="noopener noreferrer">
        <Image unoptimized src={djImage.url} alt={djImage.alt} width={djImage.width} height={djImage.height} />
      </a>
      <ol className="schedule-mobile performer-list">{djPerformers.map(performer => <li key={performer.time}><time>{performer.time}</time><div><strong>{performer.name}</strong><p>{performer.genre}</p></div></li>)}</ol>
      <a className="artwork-original-link" href={djImage.url} target="_blank" rel="noopener noreferrer">DJ 시간표 원본 보기 ↗</a>
    </section>
    <section className="festival-program-section rice-sale-section" id="rice-sale" aria-labelledby="rice-title">
      <div className="program-section-heading"><span>06 / MARKET SPECIAL</span><h2 id="rice-title">전통시장 가는 날</h2><p className="program-subtitle">쌀 할인 판매 행사</p></div>
      <div className="rice-sale-card"><p className="rice-sale-lead">고품질 쌀을 시중가 대비 저렴하게 구매하고, 온누리상품권 혜택도 받아가세요.</p>
        <p className="rice-offer">고시히까리쌀 <strong>10kg</strong><br /><b>39,000원</b></p>
        <p className="rice-benefit">{copy.linkedDescription}</p>
        <dl><div><dt>일시</dt><dd>{copy.linkedSchedule}</dd></div><div><dt>판매 장소</dt><dd>{copy.linkedLocation}</dd></div></dl>
        <p className="rice-sale-note">{copy.linkedNote}</p>
      </div>
    </section>
    <p className="detail-page-note">{copy.note}</p><a className="detail-back-link" href="/map/">행사 장소 지도 보기 →</a>
  </div></SiteFrame>
}
