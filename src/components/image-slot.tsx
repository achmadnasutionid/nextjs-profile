import Image from "next/image";
import { LogoMark } from "@/components/logo";

export function ImageSlot({
  imageUrl,
  imageAlt,
  className,
  rounded = "xl",
}: {
  imageUrl?: string;
  imageAlt?: string;
  className: string;
  rounded?: "none" | "xl" | "full";
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
          className="object-cover"
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
