import React, { ComponentType } from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "link" | "danger";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ComponentType;
  iconPosition?: "left" | "right";
  loading?: boolean;
  className?: string;
  [key: string]: unknown;
}

export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = "left",
  loading = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border-0 font-semibold text-base cursor-pointer transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e55400]/20 focus-visible:ring-offset-2 disabled:opacity-55 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "text-white bg-[#e55400] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 disabled:hover:shadow-lg",
    secondary:
      "text-k-dark-grey bg-white border-2 border-gray-200 shadow-md hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:bg-gray-100",
    outline:
      "text-k-dark-grey bg-white border-2 border-[#e55400] shadow-md hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:bg-white",
    link: "text-[#e55400] bg-transparent p-0 h-auto font-medium shadow-none hover:text-k-dark-grey hover:underline",
    danger:
      "text-white bg-red-500 shadow-md hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:bg-red-500",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${
        variantClasses[variant]
      } ${widthClass} ${className} ${loading ? "pointer-events-none" : ""}`}
      {...props}
    >
      {loading && (
        <span className="absolute w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin" />
      )}
      {!loading && Icon && iconPosition === "left" && (
        <span className="flex items-center text-xl -mr-1">
          <Icon />
        </span>
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
      {!loading && Icon && iconPosition === "right" && (
        <span className="flex items-center text-xl -ml-1">
          <Icon />
        </span>
      )}
    </button>
  );
}
