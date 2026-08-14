import Image from "next/image";
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
  logoUrl,
  tone = "light",
}: {
  href?: string;
  className?: string;
  logoUrl?: string | null;
  // "light" = sitting on a light background (header); "dark" = on the dark
  // teal footer. Each word keeps its teal/lime family but uses a shade
  // tuned for contrast against that background.
  tone?: "light" | "dark";
}) {
  const tealClass = tone === "dark" ? "text-brand-teal-100" : "text-brand-teal-600";
  const limeClass = tone === "dark" ? "text-brand-lime-400" : "text-brand-lime-600";

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 ${className ?? ""}`}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt="Bona Nauli Perkasa logo"
          width={160}
          height={40}
          className="h-9 w-auto object-contain"
        />
      ) : (
        <LogoMark />
      )}
      <span className="text-lg font-semibold tracking-tight">
        <span className={tealClass}>BONA</span>{" "}
        <span className={limeClass}>NAULI</span>{" "}
        <span className={tealClass}>PERKASA</span>
      </span>
    </Link>
  );
}
