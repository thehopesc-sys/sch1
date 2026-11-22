export default function SchoolBrandMark({ compact = false, schoolName, logo }: { compact?: boolean; schoolName: string; logo: string }) {
  return (
    <span className={`flex min-w-0 items-center gap-3 ${compact ? "text-sm" : ""}`}>
      <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo || "/logo.png"} alt="" width={48} height={48} loading="eager" fetchPriority="high" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/logo.png"; }} className="h-full w-full object-contain" />
      </span>
      <span className="min-w-0 line-clamp-2 break-words leading-tight">{schoolName}</span>
    </span>
  );
}
