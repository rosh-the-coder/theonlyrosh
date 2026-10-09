import type { Metadata } from 'next';
import CaseStudy from '@/components/flyh/CaseStudy';
import '@/styles/flyh/flyh.css';

const title = 'FlyH — From finished artwork to a listing you can trust | Roshan Najar';
const description =
  'A two-week product design case study of FlyH, a human-in-the-loop workflow that turns finished artwork into an editable, checked listing.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://theonlyrosh.com/work/flyh',
    siteName: 'Roshan Najar Portfolio',
    images: [
      {
        url: 'https://theonlyrosh.com/Work/FlyH/direction.webp',
        width: 1600,
        height: 1035,
        alt: 'FlyH Direction stage, where the creator can edit what the system believes before continuing.',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://theonlyrosh.com/Work/FlyH/direction.webp'],
  },
};

export default function FlyHCaseStudyPage() {
  return <CaseStudy />;
}
