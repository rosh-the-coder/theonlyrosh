import type { Metadata } from 'next';
import CaseStudy from '@/components/careeros/CaseStudy';

const title = 'CareerOS — AI Job Search Operating System | Roshan Najar';
const description =
  'A one-week product design and design engineering case study exploring CareerOS, an AI-assisted system for discovering relevant jobs, explaining fit, generating evidence-grounded CVs and tracking applications.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://theonlyrosh.com/work/careeros',
    siteName: 'Roshan Najar Portfolio',
    images: [
      {
        url: 'https://theonlyrosh.com/Work/CareerOS/careerOS_hero.png',
        width: 1902,
        height: 910,
        alt: 'CareerOS landing page: run your job search like a system.',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://theonlyrosh.com/Work/CareerOS/careerOS_hero.png'],
  },
};

export default function CareerOSCaseStudyPage() {
  return <CaseStudy />;
}
