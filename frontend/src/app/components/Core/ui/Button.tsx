import React from "react";
import KachaSpinner from "../../common/KachaSpinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "danger" | "success" | "subtle";
  isLoading?: boolean;
}

export default function Button({
  children,
  className = "",
  variant = "default",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-xl font-semibold transition focus:ring-2 focus:ring-offset-1 flex items-center justify-center gap-2";

  const variants = {
    default: "bg-[#FFCC00] text-black hover:bg-[#e6b800]",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    subtle: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} ${
        isLoading || disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <KachaSpinner size="sm" />}
      {children}
    </button>
  );
}
