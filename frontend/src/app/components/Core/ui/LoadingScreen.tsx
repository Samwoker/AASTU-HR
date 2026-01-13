import React from "react";

interface LoadingScreenProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  className = "w-full flex items-center justify-center py-20",
  size = 60,
  showText = true,
}) => {
  return (
    <div className={className}>
      <div className="relative flex flex-col items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M30 20 L30 80"
            stroke="#F97316"
            strokeWidth="16"
            strokeLinecap="round"
            className="k-stroke v-line"
          />

          <path
            d="M30 50 L65 20"
            stroke="#FACC15"
            strokeWidth="16"
            strokeLinecap="round"
            className="k-stroke top-slash"
          />

          <path
            d="M30 50 L65 80"
            stroke="#EA580C"
            strokeWidth="16"
            strokeLinecap="round"
            className="k-stroke bot-slash"
          />
        </svg>

        {showText && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] animate-pulse">
              Loading...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
