import Image from 'next/image'
const motifs = ['stall', 'record', 'letter-m', 'letter-a', 'bulb']
export default function PatternRibbon() {
  return <div className="pattern-ribbon" aria-hidden="true"><div className="pattern-ribbon-track">{[0,1].map(repeat => <div className="pattern-ribbon-set" key={repeat}>{Array.from({ length: 12 }, () => motifs).flat().map((motif,index) => <span key={index}><Image unoptimized loading="eager" src={'/assets/event/motif-' + motif + '.svg'} alt="" width={48} height={48} /></span>)}</div>)}</div></div>
}
