export type FlyHImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const images = {
  artwork: {
    src: '/Work/FlyH/artwork.webp',
    width: 1600,
    height: 1286,
    alt: 'FlyH Artwork stage. The drop zone is empty, a creator note is filled in, the rights box is unchecked, and Analyse artwork stays disabled.',
  },
  direction: {
    src: '/Work/FlyH/direction.webp',
    width: 1600,
    height: 1035,
    alt: 'FlyH Direction stage. FlyH reads the piece as Amber-Eyed Anime Portrait, with visible elements and mood tags, plus Edit and Continue.',
  },
  printQuality: {
    src: '/Work/FlyH/print-quality.webp',
    width: 1600,
    height: 916,
    alt: 'FlyH print-quality check. 4 by 6, 5 by 7, 8 by 10 and 11 by 14 all need resizing. The creator can upload a better original or prepare larger sizes.',
  },
  listing: {
    src: '/Work/FlyH/listing.webp',
    width: 1600,
    height: 1178,
    alt: 'FlyH Listing stage. Minimal Oak Shelf is the selected mockup, beside an editable title, description, tags, and a price the creator still has to set.',
  },
  review: {
    src: '/Work/FlyH/review.webp',
    width: 1600,
    height: 1133,
    alt: 'FlyH Review stage. A print-size coverage warning is visible, all 18 checks passed, the approval box is ticked, and Download JSON is available.',
  },
  mockupStudio: {
    src: '/Work/FlyH/mockup-studio.webp',
    width: 1600,
    height: 1515,
    alt: 'FlyH Mockup Studio. Nine calibrated portrait scenes, including Boho Bedroom, Contemporary Gallery and Minimal Oak Shelf, each marked Ready.',
  },
  aethelgard: {
    src: '/Work/FlyH/aethelgard.webp',
    width: 1400,
    height: 1616,
    alt: 'Aethelgard factory dashboard for a personal Etsy workflow, with a review queue, draft counts and a production pipeline.',
  },
  heroDashboard: {
    src: '/Work/FlyH/hero-dashboard.webp',
    width: 1620,
    height: 953,
    alt: 'FlyH Dashboard on a MacBook. The sidebar shows Dashboard, Intelligence, Listings, Mockup Studio and Settings.',
  },
  firstSale: {
    src: '/Work/FlyH/aethelgard-first-sale.webp',
    width: 690,
    height: 1010,
    alt: 'Redacted Etsy email. It reads Congratulations on your first sale, for a Vintage Art Bundle of 23 prints. The order number and transaction ID are removed.',
  },
} as const satisfies Record<string, FlyHImage>;

export const cardLayers = [
  { src: '/Work/FlyH/card-review.webp', width: 1200, height: 953 },
  { src: '/Work/FlyH/card-listing.webp', width: 1200, height: 991 },
  { src: '/Work/FlyH/card-direction.webp', width: 1200, height: 871 },
] as const;

export const stages = [
  {
    id: 'flyh-artwork',
    index: '01',
    name: 'Artwork',
    creator: 'Uploads finished artwork, adds context, and confirms the rights to sell it.',
    system: 'Analyses the file only after that confirmation.',
    image: images.artwork,
  },
  {
    id: 'flyh-direction',
    index: '02',
    name: 'Direction',
    creator: 'Can edit the understanding, adjust the direction, and approve it before anything continues.',
    system: 'Proposes what it sees, then a way to position the work.',
    image: images.direction,
  },
  {
    id: 'flyh-listing',
    index: '03',
    name: 'Listing',
    creator: 'Chooses sizes, chooses scenes, edits the copy, and sets the price.',
    system: 'Prepares print options, mockups, a title, a description and tags.',
    image: images.listing,
  },
  {
    id: 'flyh-review',
    index: '04',
    name: 'Review',
    creator: 'Fixes what blocks export, reads warnings, and gives an explicit approval.',
    system: 'Checks the listing and separates blockers from warnings.',
    image: images.review,
  },
] as const;

export const flowSteps = [
  'Finished artwork',
  'Files',
  'Print sizes',
  'Mockups',
  'Copy',
  'Tags',
  'QA',
  'Handoff',
] as const;

export const marketStats = [
  { figure: '89%', label: 'of Etsy sellers are businesses of one' },
  { figure: '48%', label: 'of seller time is other work' },
  { figure: '5.7M', label: 'active Etsy sellers, Q2 2026' },
] as const;

export type CommunitySignal = {
  id: string;
  subreddit: string;
  title: string;
  href: string | null;
  image: FlyHImage;
};

// Public seller threads. Comment cards only link when the thread URL is documented.
export const communitySignals: CommunitySignal[] = [
  {
    id: 'scared-to-post',
    subreddit: 'r/EtsySellers',
    title: 'Scared to post listings on Etsy',
    href: 'https://www.reddit.com/r/EtsySellers/comments/170j6pd/',
    image: {
      src: '/Work/FlyH/community-01.webp',
      width: 764,
      height: 231,
      alt: 'Reddit post in r/EtsySellers, titled Scared to post listings on Etsy, about finished prints waiting on mockups, tags, titles and sizes.',
    },
  },
  {
    id: 'pod-longer',
    subreddit: 'r/printondemand',
    title: 'What part of starting a POD store took much longer than you expected?',
    href: 'https://www.reddit.com/r/printondemand/comments/1wsqnb0/what_part_of_starting_a_pod_store_took_much/',
    image: {
      src: '/Work/FlyH/community-02.webp',
      width: 751,
      height: 278,
      alt: 'Reddit post in r/printondemand asking which part of starting a print-on-demand store took longer than expected.',
    },
  },
  {
    id: 'half-the-job',
    subreddit: 'r/printondemand',
    title: 'The designs are only half the job',
    href: 'https://www.reddit.com/r/printondemand/comments/1wsqnb0/what_part_of_starting_a_pod_store_took_much/',
    image: {
      src: '/Work/FlyH/community-03.webp',
      width: 747,
      height: 262,
      alt: 'Reddit comments. One says product photos and descriptions took longer than expected. Another says the designs are only half the job.',
    },
  },
  {
    id: 'listing-loop',
    subreddit: 'r/printondemand',
    title: 'Designs take a weekend. Listings take longer.',
    href: null,
    image: {
      src: '/Work/FlyH/community-04.webp',
      width: 753,
      height: 145,
      alt: 'A printing-side comment that designs are the shorter part, and listings, mockups and samples stretch the launch.',
    },
  },
  {
    id: 'listing-format',
    subreddit: 'r/Etsy',
    title: 'The New Listing Format They Are Using Is The Worst I\'ve Ever Encountered',
    href: 'https://www.reddit.com/r/Etsy/comments/14kiqkt/the_new_listing_format_they_are_using_is_the/',
    image: {
      src: '/Work/FlyH/community-05.webp',
      width: 753,
      height: 272,
      alt: 'Reddit post in r/Etsy about friction in the newer listing interface.',
    },
  },
  {
    id: 'mockups-longest',
    subreddit: 'r/printondemand',
    title: 'Mockups, samples and listings took the longest',
    href: null,
    image: {
      src: '/Work/FlyH/community-06.webp',
      width: 725,
      height: 93,
      alt: 'A short comment that mockups, samples and figuring out listings took the longest.',
    },
  },
];

export const positionRows = [
  ['Starts with', 'An idea and a design ecosystem', 'Finished creator-owned artwork'],
  ['Orientation', 'Bulk catalog production', 'Supervised listing preparation'],
  ['Primary strength', 'Scale and throughput', 'Control and visible decisions'],
  ['Scope', 'Broad, multi-channel', 'A focused challenge MVP'],
  ['Handoff', 'Multi-channel publishing', 'JSON, or a configured Etsy draft'],
  ['Product wedge', 'Production at scale', 'A trustworthy creator handoff'],
] as const;

// TODO: Set median, for example "04:12", after a controlled n=3 artwork-to-handoff run.
// The tile is omitted from the page while this stays null. Do not invent a time.
export const handoffBenchmark: { median: string } | null = null;

// FLYH DESIGN SYSTEM SOURCE
// source checkout: feature/demo-onboarding-intelligence-preview @ dc9dd71
// Portable export generated from actual FlyH source.
// Hash routes: #/ #/components #/patterns #/colors #/studies
export const liveDesignSystemUrl = '/work/flyh/design-system';

export const shifts = [
  ['Implicit knowledge', 'Explicit states'],
  ['Manual recovery', 'Guided recovery'],
  ['Personal assumptions', 'User decisions'],
  ['Automation pipeline', 'Creator-facing journey'],
] as const;

export const roles = [
  'Product Designer',
  'Frontend Engineer',
  'Backend Engineer',
  'AI Engineer',
  'UX Researcher',
  'Marketing Executive',
] as const;

export type MockupScene = {
  id: string;
  name: string;
  room: string;
  styles: string[];
  arrangement: string;
  artworkAreas: number;
  image: string | null;
};

// TODO: CONFIRM MOCKUP IMAGE PUBLICATION RIGHTS BEFORE DEPLOYMENT.
// Scene metadata is from FLYH_MOCKUP_MANIFEST.md at checkout dc9dd71.
// image stays null until those room files are cleared for theonlyrosh.com.
export const mockupScenes: MockupScene[] = [
  { id: 'boho-bedroom-portrait-4x5', name: 'Boho Bedroom', room: 'Bedroom', styles: ['boho', 'organic', 'minimal'], arrangement: 'single', artworkAreas: 1, image: null },
  { id: 'dark-academia-ornate-portrait', name: 'Dark Academia Study', room: 'Other', styles: ['dark-academia', 'vintage'], arrangement: 'single', artworkAreas: 1, image: null },
  { id: 'dark-academia-triple-floor-b', name: 'Moody Floor Trio', room: 'Studio', styles: ['dark-academia', 'vintage', 'industrial'], arrangement: 'trio', artworkAreas: 3, image: null },
  { id: 'shelf-minimal-portrait', name: 'Minimal Oak Shelf', room: 'Living room', styles: ['minimal', 'organic', 'contemporary'], arrangement: 'single', artworkAreas: 1, image: null },
  { id: 'contemporary-gallery', name: 'Contemporary Gallery', room: 'Gallery', styles: ['minimal', 'contemporary', 'luxury'], arrangement: 'single', artworkAreas: 1, image: null },
  { id: 'creative-studio', name: 'Creative Studio', room: 'Studio', styles: ['contemporary', 'industrial', 'cyber'], arrangement: 'single', artworkAreas: 1, image: null },
  { id: 'mid-century-lounge', name: 'Mid-Century Lounge', room: 'Living room', styles: ['mid-century', 'vintage', 'organic'], arrangement: 'pair', artworkAreas: 2, image: null },
  { id: 'neon-concrete-loft', name: 'Neon Concrete Loft', room: 'Studio', styles: ['cyber', 'industrial', 'contemporary'], arrangement: 'single', artworkAreas: 1, image: null },
  { id: 'soft-scandinavian-trio', name: 'Soft Scandinavian Trio', room: 'Nursery', styles: ['minimal', 'organic', 'playful'], arrangement: 'trio', artworkAreas: 3, image: null },
];

export const reviewSequence = [
  'Listing copy prepared',
  'Quality check runs',
  'A print-size claim does not match the selected files',
  'The finding is explained as a blocker or a warning',
  'The creator edits the claim',
  'The check runs again',
  'Ready',
  'The creator approves',
  'Handoff',
] as const;

export const built = [
  'Four-stage supervised listing flow',
  'Editable artwork understanding',
  'Creator-approved positioning',
  'Print-file preparation',
  'Calibrated mockup compositing',
  'Editable listing pack',
  'Quality blockers and warnings',
  'Explicit final approval',
  'JSON handoff',
] as const;

export const configured = [
  'Saved server listings',
  'Etsy draft export',
  'Live own-shop Intelligence',
] as const;

export const preview = ['Intelligence demo workspace'] as const;

export const next = [
  'Broader validation',
  'Real seller usage',
  'Commercialisation',
  'Retention',
  'Pricing validation',
] as const;

export const questions = [
  ['Can I automate this?', 'Aethelgard'],
  ['Can another creator use it?', 'FlyH'],
  ['Can six people build it together?', 'Challenge MVP'],
  ['Can people trust the handoff?', 'Human-controlled workflow'],
  ['Can it become a repeatable business?', 'MVP to MVB'],
] as const;

export type DrawerId = 'origin' | 'journey' | 'control' | 'system' | 'scope' | 'team';

export const drawerMeta: Record<DrawerId, { title: string }> = {
  origin: { title: 'Origin' },
  journey: { title: 'Journey anatomy' },
  control: { title: 'Human control map' },
  system: { title: 'Design system' },
  scope: { title: 'Scope' },
  team: { title: 'Team' },
};
