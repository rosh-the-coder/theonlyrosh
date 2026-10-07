import type { Metadata } from 'next';
import CaseStudy from '@/components/rvv/CaseStudy';

export const metadata: Metadata = {
  title: 'RedVelvetVault — Case study',
  description: 'A browser-based art platform where familiar web discovery leads into walkable 3D galleries.',
};

export default function RedVelvetVaultCaseStudyPage() {
  return <CaseStudy />;
}
