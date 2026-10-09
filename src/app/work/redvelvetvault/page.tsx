import type { Metadata } from 'next';
import CaseStudy from '@/components/rvv/CaseStudy';

export const metadata: Metadata = {
  title: 'RedVelvetVault — Case study',
  description: 'A web platform where artists can share their work and visitors can explore it in a 3D gallery.',
};

export default function RedVelvetVaultCaseStudyPage() {
  return <CaseStudy />;
}
