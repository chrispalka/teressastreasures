import { cn } from "@/lib/utils";

interface LeopardPatternProps {
  className?: string;
  opacity?: number;
}

export function LeopardPattern({
  className,
  opacity = 0.06,
}: LeopardPatternProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="leopard"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <ellipse
              cx="15"
              cy="12"
              rx="6"
              ry="5"
              fill="#3C2415"
              transform="rotate(-15 15 12)"
            />
            <ellipse
              cx="42"
              cy="8"
              rx="5"
              ry="4"
              fill="#3C2415"
              transform="rotate(20 42 8)"
            />
            <ellipse
              cx="8"
              cy="35"
              rx="5"
              ry="6"
              fill="#3C2415"
              transform="rotate(10 8 35)"
            />
            <ellipse
              cx="35"
              cy="30"
              rx="7"
              ry="5"
              fill="#3C2415"
              transform="rotate(-25 35 30)"
            />
            <ellipse
              cx="50"
              cy="45"
              rx="5"
              ry="4"
              fill="#3C2415"
              transform="rotate(15 50 45)"
            />
            <ellipse
              cx="22"
              cy="52"
              rx="6"
              ry="5"
              fill="#3C2415"
              transform="rotate(-10 22 52)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#leopard)" />
      </svg>
    </div>
  );
}
