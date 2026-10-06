import type { Metadata } from 'next';
import CaseStudy from '@/components/rvv/CaseStudy';

export const metadata: Metadata = {
  title: 'RedVelvetVault — Case study',
  description: 'A tested desktop prototype for finding art, then walking into the gallery.',
};

export default function RedVelvetVaultCaseStudyPage() {
  return <CaseStudy />;
}
