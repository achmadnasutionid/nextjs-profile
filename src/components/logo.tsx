import { Link } from "@/i18n/navigation";

// Placeholder brand mark — swap the <svg> below for the client's real logo file
// (e.g. an <Image src="/logo.svg" .../>) once it's provided; layout/sizing stays the same.
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Bona Nauli Perkasa logo"
    >
      <circle cx="20" cy="20" r="20" className="fill-brand-teal-600" />
      <path
        d="M20 8c5 4 8 9 8 13.5A8 8 0 0 1 12 21.5C12 17 15 12 20 8Z"
        className="fill-brand-lime-400"
      />
      <path
        d="M20 32c-2.5-3-4-6.5-4-9.5"
        stroke="#0c4f43"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 ${className ?? ""}`}
    >
      <LogoMark />
      <span className="text-lg font-semibold tracking-tight text-brand-teal-900">
        Bona Nauli Perkasa
      </span>
    </Link>
  );
}
