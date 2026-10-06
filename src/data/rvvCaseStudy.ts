export type AssetStatus = 'pending' | 'ready';

export type CaseAsset = {
  id: string;
  source: string;
  pdfPage: string | null;
  status: AssetStatus;
  alt: string;
  aspectRatio: string;
  location: string;
};

export const assets: CaseAsset[] = [
  { id: 'rvv-hero-current-gallery', source: 'Current Unity gallery build', pdfPage: null, status: 'pending', alt: 'Current gallery room with artwork on the walls', aspectRatio: '16 / 9', location: 'Hero' },
  { id: 'rvv-walkthrough-loop', source: 'New screen recording', pdfPage: null, status: 'pending', alt: 'Loop from a gallery card into the room and an artwork', aspectRatio: '16 / 9', location: 'Walkthrough' },
  { id: 'rvv-walkthrough-poster', source: 'Frame from that recording', pdfPage: null, status: 'pending', alt: 'Poster matching the walkthrough loop', aspectRatio: '16 / 9', location: 'Walkthrough' },
  { id: 'rvv-fig05-platform-preference', source: 'Fig. 5, or the 7/9 redraw on this page', pdfPage: '22', status: 'ready', alt: '7 of 9 chose web for a role-playing 3D gallery', aspectRatio: '8 / 1', location: 'Pivot' },
  { id: 'rvv-fig42-mobile-mid-fi', source: 'Fig. 42', pdfPage: '65', status: 'ready', alt: 'Mobile mid-fidelity tested with three people', aspectRatio: '3 / 2', location: 'Pivot and explorations panel' },
  { id: 'rvv-fig44-mobile-hi-fi', source: 'Fig. 44', pdfPage: '67', status: 'ready', alt: 'Mobile high-fidelity gallery', aspectRatio: '3 / 2', location: 'Pivot' },
  { id: 'rvv-fig45-mobile-room', source: 'Fig. 45', pdfPage: '68', status: 'ready', alt: 'Mobile room and artwork detail from the high-fidelity exploration', aspectRatio: '3 / 2', location: 'Pivot' },
  { id: 'rvv-fig46-first-web', source: 'Fig. 46', pdfPage: '69', status: 'ready', alt: 'First desktop web iteration', aspectRatio: '16 / 9', location: 'Pivot' },
  { id: 'rvv-fig43-revised-home-sketch', source: 'Fig. 43', pdfPage: '66', status: 'ready', alt: 'Revised home sketch after dense mid-fi feedback', aspectRatio: '3 / 2', location: 'Pivot and explorations panel' },
  { id: 'rvv-fig62-gallery-iterations', source: 'Fig. 62', pdfPage: '105', status: 'ready', alt: 'Gallery iteration frames', aspectRatio: '16 / 9', location: 'Testing' },
  { id: 'rvv-fig63-camera', source: 'Fig. 63', pdfPage: '107', status: 'pending', alt: 'Camera control iteration', aspectRatio: '16 / 9', location: 'Testing' },
  { id: 'rvv-current-home-card', source: 'Current build', pdfPage: null, status: 'pending', alt: 'Home gallery card', aspectRatio: '3 / 2', location: 'Visitor journey' },
  { id: 'rvv-current-unity-room', source: 'Current build', pdfPage: null, status: 'pending', alt: 'Unity room', aspectRatio: '16 / 9', location: 'Visitor journey' },
  { id: 'rvv-current-artwork-modal', source: 'Current build', pdfPage: null, status: 'pending', alt: 'Artwork detail modal without a profile link', aspectRatio: '3 / 2', location: 'Visitor journey' },
  { id: 'rvv-current-gallery-header-profile', source: 'Current build', pdfPage: null, status: 'pending', alt: 'Gallery header that opens the artist profile', aspectRatio: '3 / 2', location: 'Visitor journey' },
  { id: 'rvv-current-my-gallery', source: 'Current build, MyGalleryPage', pdfPage: null, status: 'pending', alt: 'My Gallery', aspectRatio: '16 / 9', location: 'Creator journey' },
  { id: 'rvv-current-wall-slot-upload', source: 'Current build, ArtworkUploadModal', pdfPage: null, status: 'pending', alt: 'Upload from a wall slot', aspectRatio: '3 / 2', location: 'Creator journey' },
  { id: 'rvv-current-management-grid', source: 'Current build, ArtworkManagementGrid', pdfPage: null, status: 'pending', alt: 'Artwork management grid', aspectRatio: '16 / 9', location: 'Creator journey' },
  { id: 'rvv-current-go-live', source: 'Current build, GO LIVE toggle', pdfPage: null, status: 'pending', alt: 'GO LIVE control', aspectRatio: '3 / 2', location: 'Creator journey' },
  { id: 'rvv-current-controls-overlay', source: 'Current build', pdfPage: null, status: 'pending', alt: 'Controls overlay in the Unity room', aspectRatio: '16 / 9', location: 'Testing' },
  { id: 'rvv-current-loading-state', source: 'Current build', pdfPage: null, status: 'pending', alt: 'Loading state before the room is ready', aspectRatio: '16 / 9', location: 'Testing' },
  { id: 'rvv-fig49-palette', source: 'Fig. 49', pdfPage: '74', status: 'ready', alt: 'Report colour palette', aspectRatio: '16 / 9', location: 'Design system' },
  { id: 'rvv-fig52-type', source: 'Fig. 52', pdfPage: '77', status: 'ready', alt: 'Report type specimens', aspectRatio: '16 / 9', location: 'Design system' },
  { id: 'rvv-fig53-hierarchy', source: 'Fig. 53', pdfPage: '78', status: 'ready', alt: 'Report hierarchy specimens', aspectRatio: '16 / 9', location: 'Design system' },
  { id: 'rvv-figma-tokens-current', source: 'Current Figma variables', pdfPage: null, status: 'pending', alt: 'Current Figma token values', aspectRatio: '16 / 9', location: 'Design system' },
  { id: 'rvv-research-gallery-entry-paper', source: 'Fig. 38. Fig. 60 was supplied and held because it shows participants.', pdfPage: '61–62', status: 'ready', alt: 'Paper screens of gallery entry', aspectRatio: '3 / 2', location: 'Research' },
];

export const panelIds = [
  'survey',
  'competitors',
  'explorations',
  'testing',
  'ia',
  'design-system',
  'scope',
] as const;

export type PanelId = (typeof panelIds)[number];

export const heroVideoUrl =
  'https://pub-14e70177217f4d5481f61d1335a55a75.r2.dev/rvv/redvelvetvault-hero.mp4';

export const walkthroughVideoUrl =
  'https://pub-14e70177217f4d5481f61d1335a55a75.r2.dev/rvv/redvelvetvault-walkthrough.mp4';

export const prototypeUrl =
  'https://www.figma.com/proto/IrRpfLUo6AThFUw8EH0AR7/RedVelvetVault?page-id=428%3A236&node-id=436-1167&viewport=534%2C168%2C0.08&t=0zoNS4UXreCVnlVd-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=436%3A1167&show-proto-sidebar=1';

export const metrics = [
  {
    figure: '93%',
    label: 'said artwork interactions were clear',
    support: '13 of 14 rated clarity 4–5/5',
    filled: 13,
  },
  {
    figure: '86%',
    label: 'said they would use it again',
    support: '12 of 14 answered Yes',
    filled: 12,
  },
  {
    figure: '71%',
    label: 'understood its purpose immediately',
    support: '10 of 14 rated clarity 4–5/5',
    filled: 10,
  },
] as const;

export const lessons = [
  ['Make entry familiar.', 'ArtStation-style context and visual cards helped people choose what to open.'],
  ['Let the space breathe.', 'Arrival and ArtSteps reinforced the value of legible rooms, while Spatial and OnCyber gave me movement patterns to test rather than copy wholesale.'],
  ['Keep the artist close.', 'Artwork metadata, profiles and a lightweight social layer connect the room back to its maker.'],
] as const;

export const competitorHeaders = [
  'Reference',
  'Observed strength',
  'Friction / trade-off in my review',
  'RVV design response',
] as const;

export const competitors = [
  ['Spatial.io', 'Polished walkable environments and familiar game-like movement.', 'Busy entry and controls could overwhelm a first-time gallery visitor.', 'Benchmark movement; make card-to-room entry calmer and add visible controls help.'],
  ['OnCyber', 'Flexible, visually striking 3D displays.', 'Crypto/wallet cues and open-ended worlds were farther from an art-first visit.', 'Keep spatial freedom but use curated rooms and an account-based web entry.'],
  ['Arrival.Space', 'Restrained architecture gives the artwork space.', 'The review found fewer routes to discovering and connecting with artists.', 'Pair visual calm and generous room proportions with artist context and profiles.'],
  ['ArtStation', 'Rich artwork metadata and artist identity.', 'Heavy interface density and a scroll-based, entirely 2D experience.', 'Keep title, tags and artist context; separate primary destinations from utilities and offer a room as another way to view art.'],
  ['SuperRare', 'Strong curation and artist storytelling.', 'Investment/NFT framing could make casual exploration feel financialised.', 'Keep story and creator identity without presenting the prototype as a speculative marketplace.'],
  ['ArtSteps', 'Recognisable rooms make exhibitions approachable.', 'Presentation and camera controls felt dated in my review.', 'Keep legible room circulation; iterate Unity lighting, scale and controls.'],
] as const;

export const explorations = [
  ['Early survey', 'Seven of nine people preferred the web for a role-playing 3D gallery.', 'That was one question about a 3D gallery, not a vote on the whole product.'],
  ['Mobile high-fidelity', 'I worked out the flow on the phone first.', 'Figs. 44 and 45 are that pass. They are earlier screens, not the current build.'],
  ['Moderated mid-fi', 'Three people found the cards and the room cramped.', 'Fig. 42 is what they tried. This round is separate from the later survey.'],
  ['Informal comparison', 'I put two Home directions next to each other at phone size.', 'It was not a controlled test, and the report does not say how many people saw it.'],
  ['Desktop decision', 'I built the full gallery for desktop.', 'The later survey of 14 people did not cause this choice. Logged-out phones still cannot sign in.'],
] as const;

export const iaBranches = [
  { title: 'Home', route: '/home', children: ['Discover cards', 'Search opens a visitor gallery', 'Featured room, optional'] },
  { title: 'Shop', route: '/shop', children: ['Artwork listing', 'Cart', 'Checkout, not finished'], dashedLast: true },
  { title: 'Gallery', route: '/my-gallery', children: ['Wall-slot upload', 'Preview the room', 'GO LIVE'] },
  { title: 'Social', route: '/social', children: ['Following / Explore', 'Create or open post', 'Comments'] },
  { title: 'Profile', route: '/profile', children: ['Bio and artworks', 'Follow and message', 'Website, if set'] },
] as const;

export const panelMeta: Record<PanelId, { title: string; width: string }> = {
  survey: { title: 'What 14 people said after trying it', width: 'md:w-[min(560px,100%)]' },
  competitors: { title: 'What I learned from other art platforms', width: 'md:w-[min(960px,100%)]' },
  explorations: { title: 'Why I moved from phone to desktop', width: 'md:w-[min(760px,100%)]' },
  testing: { title: 'What changed when people tried it', width: 'md:w-[min(760px,100%)]' },
  ia: { title: 'How the app is organised', width: 'md:w-[min(880px,100%)]' },
  'design-system': { title: 'Why it looks this way', width: 'md:w-[min(720px,100%)]' },
  scope: { title: 'What I built, what I learned, what is still open', width: 'md:w-[min(880px,100%)]' },
};

/** Visible trigger copy → panel. No in-panel links are specified in the current Figma prototype. */
export const triggerMap: { source: string; panel: PanelId; close: string }[] = [
  { source: 'See the research', panel: 'survey', close: 'Escape, close, or backdrop returns focus to the trigger' },
  { source: 'See the survey results', panel: 'survey', close: 'Escape, close, or backdrop returns focus to the trigger' },
  { source: 'See the full comparison', panel: 'competitors', close: 'Escape, close, or backdrop returns focus to the trigger' },
  { source: 'See the early directions', panel: 'explorations', close: 'Escape, close, or backdrop returns focus to the trigger' },
  { source: 'See what testing showed', panel: 'testing', close: 'Escape, close, or backdrop returns focus to the trigger' },
  { source: 'Explore the app structure', panel: 'ia', close: 'Escape, close, or backdrop returns focus to the trigger' },
  { source: 'See the design-system decisions', panel: 'design-system', close: 'Escape, close, or backdrop returns focus to the trigger' },
  { source: "See what was built and what's next", panel: 'scope', close: 'Escape, close, or backdrop returns focus to the trigger' },
];
