export default function ReportFigure({ file, caption, tall = false }: { file: string; caption: string; tall?: boolean }) {
  return (
    <figure data-asset={`fig-${file}`} className="min-w-0">
      <img
        src={`/Work/RVV/case-study-v2/${file}.png`}
        alt={caption}
        className={`w-full rounded-2xl border border-white/10 bg-[#1a1a1a] object-contain ${tall ? 'max-h-[78vh]' : 'max-h-[640px]'}`}
      />
      <figcaption className="mt-2 text-sm leading-6 text-[#aaa]">{caption}</figcaption>
    </figure>
  );
}
