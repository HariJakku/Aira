import Image from "next/image";

type LogoVariant = "full" | "mark" | "symbol" | "wordmark";

interface AiraLogoProps {
  variant?: LogoVariant;
  size?: number;
  className?: string;
  showTagline?: boolean;
  light?: boolean;
}

export default function AiraLogo({
  variant = "mark",
  size = 40,
  className = "",
  showTagline = false,
  light = false,
}: AiraLogoProps) {
  if (variant === "full") {
    return (
      <Image src="/aira-logo.jpeg" alt="AIRA – Curate Your Joy"
        width={size} height={size}
        className={`object-contain ${className}`} priority />
    );
  }

  if (variant === "mark") {
    return (
      <Image src="/icons/icon-192x192.png" alt="AIRA"
        width={size} height={size}
        className={`object-contain ${className}`} priority />
    );
  }

  if (variant === "symbol") {
    return (
      <Image src="/aira-symbol.png" alt="AIRA"
        width={size} height={size}
        className={`object-contain ${className}`} priority />
    );
  }

  const gold  = light ? "#C4AF8F" : "#8B7355";
  const muted = light ? "rgba(196,175,143,0.55)" : "rgba(139,115,85,0.5)";
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="font-display font-semibold leading-none"
        style={{ fontSize: size * 0.7, color: gold, letterSpacing: "0.18em" }}>
        AIRA
      </span>
      {showTagline && (
        <span className="leading-none mt-0.5"
          style={{ fontSize: size * 0.22, color: muted, letterSpacing: "0.28em" }}>
          CURATE YOUR JOY
        </span>
      )}
    </div>
  );
}