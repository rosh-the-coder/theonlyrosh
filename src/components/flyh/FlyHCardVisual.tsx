import Image from 'next/image';
import { cardLayers } from '@/data/flyh/content';
import '@/styles/flyh/flyh.css';

export default function FlyHCardVisual({ lifted }: { lifted: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden rounded-[16px] bg-[#111613]">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#145C46]" />
      <div className={`flyh-card-layer absolute right-[-8%] top-[8%] z-[1] h-[88%] w-[76%] overflow-hidden rounded-lg border border-[#DFE2DE] bg-[#F7F6F2] ${lifted ? 'is-lifted' : ''}`} style={{ ['--flyh-lift' as string]: '-6px' }}>
        <Image src={cardLayers[0].src} alt="" fill sizes="40vw" className="object-cover object-left-top" />
      </div>
      <div className={`flyh-card-layer absolute left-[-6%] top-[14%] z-[2] h-[84%] w-[74%] overflow-hidden rounded-lg border border-[#DFE2DE] bg-[#F7F6F2] ${lifted ? 'is-lifted' : ''}`} style={{ ['--flyh-lift' as string]: '-10px' }}>
        <Image src={cardLayers[1].src} alt="" fill sizes="40vw" className="object-cover object-left-top" />
      </div>
      <div className={`flyh-card-layer absolute left-[5%] top-[3%] z-[3] h-[92%] w-[84%] overflow-hidden rounded-lg border border-[#DFE2DE] bg-[#F7F6F2] ${lifted ? 'is-lifted' : ''}`} style={{ ['--flyh-lift' as string]: '-16px' }}>
        <Image src={cardLayers[2].src} alt="" fill sizes="40vw" className="object-cover object-left-top" />
      </div>
    </div>
  );
}