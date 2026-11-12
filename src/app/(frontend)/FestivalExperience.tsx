import Image from 'next/image'
import type { SiteCopy } from '@/lib/content-schema'
import { djPerformers, festivalArtwork, schoolPerformers } from '@/lib/festival-artwork'
import SiteFrame from './SiteFrame'
import TimetableOverview from './TimetableOverview'
import FestivalTabs from './FestivalTabs'

export default function FestivalExperience({ site }: { site: SiteCopy }) {
  const copy = site.festivalPage
  const speaker = copy.programs.find(program => program.title.includes('말왕'))
  const school = copy.programs.find(program => program.title.includes('버스킹'))
  const dj = copy.programs.find(program => program.title.includes('DJ'))
  const sections = [
    ['overview', '행사 안내'], ['art-flea-market', '아트플리마켓'], ['school-popup', '스쿨뮤직 팝업'],
    ['malwang', '말왕 토크쇼·사인회'], ['school-music', '스쿨뮤직 버스킹'],
    ['dj-rave', 'DJ RAVE & Doodle 테이블'], ['rice-sale', '쌀 할인 판매 행사'],
  ]
  const speakerImage = copy.speakerImage || festivalArtwork.speaker
  const schoolImage = copy.schoolTimetable || festivalArtwork.school
  const djImage = copy.djTimetable || festivalArtwork.dj
  return <SiteFrame site={site}><div className="detail-page-inner festival-detail-page">
    <header className="detail-page-heading"><span>{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.description}</p>
      <div className="event-quick-facts"><span>{copy.date}</span><span>{copy.schedule}</span><span>{copy.location}</span></div>
    </header>
    <FestivalTabs sections={sections} />
    <section className="festival-program-section" id="overview" aria-labelledby="overview-title">
      <div className="program-section-heading"><span>01 / TIME TABLE</span><h2 id="overview-title">행사 안내</h2></div>
      <TimetableOverview image={copy.timetable || festivalArtwork.overview} />
    </section>
    <section className="festival-program-section" id="art-flea-market" aria-labelledby="art-flea-market-title">
      <div className="program-section-heading"><span>02 / ART FLEA MARKET</span><h2 id="art-flea-market-title">아트플리마켓</h2></div>
      <div className="school-popup-info"><p className="school-popup-time">14:00–21:00</p><dl><div><dt>장소</dt><dd>구월모래내시장</dd></div><div><dt>구역</dt><dd>중앙광장 - 서문 · 곱창골목 거리</dd></div></dl></div>
      <a className="artwork-original-link" href="/map/#flea-market">구역별 플리마켓 부스 보기 ↗</a>
    </section>
    <section className="festival-program-section" id="school-popup" aria-labelledby="school-popup-title">
      <div className="program-section-heading"><span>03 / SCHOOL MUSIC POP-UP</span><h2 id="school-popup-title">스쿨뮤직 팝업</h2></div>
      <div className="school-popup-info"><p className="school-popup-time">14:00–21:00</p><dl><div><dt>장소</dt><dd>{school?.place || '구월모래내시장 서문 일원'}</dd></div><div><dt>안내</dt><dd>스쿨뮤직 버스킹과 같은 장소에서 진행합니다.</dd></div></dl></div>
    </section>
    <section className="festival-program-section" id="malwang" aria-labelledby="malwang-title">
      <div className="program-section-heading"><span>04 / SPECIAL GUEST</span><h2 id="malwang-title">말왕 토크쇼·사인회</h2></div>
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
    <section className="festival-program-section" id="school-music" aria-labelledby="school-title">
      <div className="program-section-heading"><span>05 / SCHOOL MUSIC BUSKING</span><h2 id="school-title">스쿨뮤직 버스킹</h2></div>
      <div className="program-facts"><p><strong>버스킹</strong> {school?.time || '17:30–21:00'}</p><p>{school?.place || '구월모래내시장 서문 일원'}</p></div>
      <a className="event-artwork schedule-desktop" href={schoolImage.url} target="_blank" rel="noopener noreferrer">
        <Image unoptimized src={schoolImage.url} alt={schoolImage.alt} width={schoolImage.width} height={schoolImage.height} />
      </a>
      <ol className="schedule-mobile performer-list">{schoolPerformers.map(performer => <li key={performer.time}><time>{performer.time}</time><strong>{performer.name}</strong></li>)}</ol>
      <a className="artwork-original-link" href={schoolImage.url} target="_blank" rel="noopener noreferrer">스쿨뮤직 시간표 원본 보기 ↗</a>
    </section>
    <section className="festival-program-section" id="dj-rave" aria-labelledby="dj-title">
      <div className="program-section-heading"><span>06 / DJ RAVE</span><h2 id="dj-title">DJ RAVE &amp; Doodle 테이블</h2></div>
      <div className="program-facts"><p><strong>{dj?.time || '17:00–21:00'}</strong></p><p>{dj?.place || '구월시장 포차거리'}</p><p>음악과 드로잉을 함께 즐기는 DJ RAVE &amp; Doodle 테이블</p></div>
      <a className="event-artwork schedule-desktop dj-artwork" href={djImage.url} target="_blank" rel="noopener noreferrer">
        <Image unoptimized src={djImage.url} alt={djImage.alt} width={djImage.width} height={djImage.height} />
      </a>
      <ol className="schedule-mobile performer-list">{djPerformers.map(performer => <li key={performer.time}><time>{performer.time}</time><div><strong>{performer.name}</strong><p>{performer.genre}</p></div></li>)}</ol>
      <a className="artwork-original-link" href={djImage.url} target="_blank" rel="noopener noreferrer">DJ 시간표 원본 보기 ↗</a>
    </section>
    <section className="festival-program-section rice-sale-section" id="rice-sale" aria-labelledby="rice-title">
      <div className="program-section-heading"><span>07 / MARKET SPECIAL</span><h2 id="rice-title">쌀 할인 판매 행사</h2><p className="program-subtitle">전통시장 가는 날</p></div>
      <div className="rice-sale-card">
        <p className="rice-offer">고시히까리쌀 <strong>10kg</strong><br /><b>39,000원</b></p>
        <div className="rice-benefit"><span className="rice-benefit-badge">온누리상품권 1만 원권 증정</span><p className="rice-purchase-limit">(1인 최대 3포 구매 제한)</p></div>
        <dl><div><dt>일시</dt><dd>{copy.linkedSchedule}</dd></div><div><dt>판매 장소</dt><dd>{copy.linkedLocation}</dd></div></dl>
        <p className="rice-sale-note">{copy.linkedNote}</p>
      </div>
    </section>
    <p className="detail-page-note">{copy.note}</p><a className="detail-back-link artwork-original-link" href="/map/">행사 장소 지도 보기 →</a>
  </div></SiteFrame>
}
