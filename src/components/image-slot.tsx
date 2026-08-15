import Image from "next/image";
import { LogoMark } from "@/components/logo";

export function ImageSlot({
  imageUrl,
  imageAlt,
  className,
  rounded = "xl",
  fit = "cover",
}: {
  imageUrl?: string;
  imageAlt?: string;
  className: string;
  rounded?: "none" | "xl" | "full";
  fit?: "cover" | "contain";
}) {
  const roundedClass =
    rounded === "full" ? "rounded-full" : rounded === "xl" ? "rounded-3xl" : "";
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${roundedClass} ${className}`}>
        <Image
          src={imageUrl}
          alt={imageAlt ?? ""}
          fill
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center ${roundedClass} bg-gradient-to-br from-brand-teal-600 to-brand-teal-900 ${className}`}
    >
      <LogoMark className="h-16 w-16 opacity-80" />
    </div>
  );
}
