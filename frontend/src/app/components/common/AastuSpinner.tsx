import React from "react";

interface aastuSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "inline" | "screen";
  showText?: boolean;
  text?: string;
}

export const aastu_SPINNER_CYCLE_MS = 1200;

const aastuSpinner: React.FC<aastuSpinnerProps> = ({
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
        /* 
         * Draw-Erase-Redraw Animation Cycle for 'A'
         * One full cycle: Draw all 3 strokes sequentially → Erase all 3 strokes sequentially
         * Timeline (100% = full cycle):
         *   0-10%:   Draw left leg
         *   10-20%:  Draw right leg
         *   20-30%:  Draw cross bar
         *   30-50%:  Hold complete A
         *   50-60%:  Erase left leg
         *   60-70%:  Erase right leg
         *   70-80%:  Erase cross bar
         *   80-100%: Pause before restart
         */
        
        @keyframes aastu-draw-erase-left-leg {
          0% {
            stroke-dashoffset: 100;
          }
          10%, 50% {
            stroke-dashoffset: 0;
          }
          60%, 100% {
            stroke-dashoffset: 100;
          }
        }

        @keyframes aastu-draw-erase-right-leg {
          0%, 10% {
            stroke-dashoffset: 100;
          }
          20%, 50% {
            stroke-dashoffset: 0;
          }
          70%, 100% {
            stroke-dashoffset: 100;
          }
        }

        @keyframes aastu-draw-erase-cross-bar {
          0%, 20% {
            stroke-dashoffset: 100;
          }
          30%, 50% {
            stroke-dashoffset: 0;
          }
          80%, 100% {
            stroke-dashoffset: 100;
          }
        }

        @keyframes aastu-a-breathe {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.03); }
        }

        .aastu-a-wrapper {
          animation: aastu-a-breathe ${aastu_SPINNER_CYCLE_MS}ms ease-in-out infinite;
          will-change: transform;
        }

        .aastu-stroke {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          will-change: stroke-dashoffset;
        }

        .aastu-left-leg { 
          animation: aastu-draw-erase-left-leg ${aastu_SPINNER_CYCLE_MS}ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
          filter: drop-shadow(0 0 3px rgba(229, 84, 0, 0.35)); 
        }
        
        .aastu-right-leg { 
          animation: aastu-draw-erase-right-leg ${aastu_SPINNER_CYCLE_MS}ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
          filter: drop-shadow(0 0 3px rgba(229, 84, 0, 0.35)); 
        }
        
        .aastu-cross-bar { 
          animation: aastu-draw-erase-cross-bar ${aastu_SPINNER_CYCLE_MS}ms cubic-bezier(0.4, 0, 0.2, 1) infinite;
          filter: drop-shadow(0 0 3px rgba(229, 84, 0, 0.28)); 
        }
      `}</style>

      <div className="aastu-a-wrapper">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="aastu-a-svg-container"
        >
          {/* Left leg of A - Orange */}
          <path
            d="M50 20 L25 80"
            stroke="#e55400"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            pathLength={100}
            className="aastu-stroke aastu-left-leg"
          />

          {/* Right leg of A - Orange */}
          <path
            d="M50 20 L75 80"
            stroke="#e55400"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            pathLength={100}
            className="aastu-stroke aastu-right-leg"
          />

          {/* Cross bar of A - Orange */}
          <path
            d="M35 55 L65 55"
            stroke="#e55400"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            pathLength={100}
            className="aastu-stroke aastu-cross-bar"
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

export default aastuSpinner;

