export default function ReportFigure({ file, caption }: { file: string; caption: string }) {
  return (
    <figure data-asset={`fig-${file}`} className="min-w-0">
      <img
        src={`/Work/RVV/case-study-v2/${file}.png`}
        alt={caption}
        className="max-h-[640px] w-full rounded-2xl border border-white/10 bg-[#1a1a1a] object-contain"
      />
      <figcaption className="mt-2 text-sm leading-6 text-[#aaa]">{caption}</figcaption>
    </figure>
  );
}
