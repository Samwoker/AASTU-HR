import React from "react";

interface LoadingSkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "card" | "table-row";
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export default function LoadingSkeleton({
  variant = "text",
  width,
  height,
  className = "",
  count = 1,
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  const getClasses = () => {
    const baseClasses = "bg-gray-200 animate-pulse rounded";
    
    switch (variant) {
      case "circular":
        return `${baseClasses} rounded-full`;
      case "rectangular":
        return `${baseClasses} rounded-lg`;
      case "card":
        return "bg-white p-6 rounded-2xl shadow-card border border-gray-100";
      case "table-row":
        return "flex items-center gap-4 py-4 border-b border-gray-50";
      default:
        return `${baseClasses} rounded-md h-4`;
    }
  };

  const renderSkeleton = (index: number) => {
    if (variant === "card") {
      return (
        <div key={index} className={`${getClasses()} ${className}`}>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      );
    }

    if (variant === "table-row") {
        return (
            <div key={index} className={`${getClasses()} ${className}`}>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
                </div>
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
        )
    }

    return (
      <div
        key={index}
        className={`${getClasses()} ${className}`}
        style={{
          width: width,
          height: height,
        }}
      />
    );
  };

  return <>{skeletons.map((_, i) => renderSkeleton(i))}</>;
}
