import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  color?: string;
}

export function SectionDivider({
  className,
  color = "#C9A96E",
}: SectionDividerProps) {
  return (
    <div
      className={cn("flex items-center justify-center py-6", className)}
      aria-hidden="true"
    >
      <svg
        width="200"
        height="24"
        viewBox="0 0 200 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left leaf */}
        <path
          d="M30 12C40 6 55 4 70 8C60 4 45 2 30 12Z"
          stroke={color}
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M35 14C42 10 52 9 62 11"
          stroke={color}
          strokeWidth="0.5"
          fill="none"
        />
        {/* Center dot */}
        <circle cx="100" cy="12" r="2" fill={color} />
        {/* Right leaf (mirrored) */}
        <path
          d="M170 12C160 6 145 4 130 8C140 4 155 2 170 12Z"
          stroke={color}
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M165 14C158 10 148 9 138 11"
          stroke={color}
          strokeWidth="0.5"
          fill="none"
        />
        {/* Lines extending outward */}
        <line x1="0" y1="12" x2="25" y2="12" stroke={color} strokeWidth="0.5" />
        <line
          x1="175"
          y1="12"
          x2="200"
          y2="12"
          stroke={color}
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
