import React from "react";

interface KachaSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "inline" | "screen";
  showText?: boolean;
  text?: string;
}

export const KACHA_SPINNER_CYCLE_MS = 1200;

const KachaSpinner: React.FC<KachaSpinnerProps> = ({
  size = "md",
  className = "",
  variant = "inline",
  showText,
  text = "Loading...",
}) => {
  const sizeMap = {
    sm: 20,
    md: 28,
    lg: 40,
    xl: 52,
  };

  const svgSize = sizeMap[size];

  const resolvedShowText =
    typeof showText === "boolean"
      ? showText
      : variant === "screen" && size !== "sm";

  return (
    <div
      className={`inline-flex flex-col items-center justify-center ${className}`}
    >
      <style>{`
        @keyframes kacha-k-cycle {
          0%, 6% {
            stroke-dashoffset: 100;
            opacity: 0;
          }
          10%, 100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        @keyframes kacha-k-fade {
          0%, 90% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes kacha-k-breathe {
          0%, 100% { transform: scale(1); }
          45% { transform: scale(1.03); }
        }

        .kacha-k-wrapper {
          animation: kacha-k-breathe ${KACHA_SPINNER_CYCLE_MS}ms ease-in-out infinite;
          will-change: transform;
        }

        .kacha-k-svg {
          animation: kacha-k-fade ${KACHA_SPINNER_CYCLE_MS}ms ease-in-out infinite;
        }

        .kacha-stroke {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: kacha-k-cycle ${KACHA_SPINNER_CYCLE_MS}ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: stroke-dashoffset, opacity;
        }

        /* Sequence: vertical -> top -> bottom */
        .kacha-v-line { animation-delay: 0ms; }
        .kacha-top-slash { animation-delay: 220ms; }
        .kacha-bot-slash { animation-delay: 440ms; }

        /* Slightly different glow per stroke for depth */
        .kacha-v-line { filter: drop-shadow(0 0 3px rgba(229, 84, 0, 0.35)); }
        .kacha-top-slash { filter: drop-shadow(0 0 3px rgba(255, 218, 0, 0.45)); }
        .kacha-bot-slash { filter: drop-shadow(0 0 3px rgba(229, 84, 0, 0.28)); }
      `}</style>

      <div className="kacha-k-wrapper">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="kacha-k-svg"
        >
          {/* Vertical line (left side of K) - Orange */}
          <path
            d="M30 20 L30 80"
            stroke="#e55400"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            pathLength={100}
            className="kacha-stroke kacha-v-line"
          />

          {/* Top diagonal slash (upper part of K) - Yellow */}
          <path
            d="M30 50 L65 20"
            stroke="#ffda00"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            pathLength={100}
            className="kacha-stroke kacha-top-slash"
          />

          {/* Bottom diagonal slash (lower part of K) - Orange */}
          <path
            d="M30 50 L65 80"
            stroke="#e55400"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            pathLength={100}
            className="kacha-stroke kacha-bot-slash"
          />
        </svg>
      </div>

      {resolvedShowText && (
        <div className="mt-3 text-center">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse">
            {text}
          </p>
        </div>
      )}
    </div>
  );
};

export default KachaSpinner;
