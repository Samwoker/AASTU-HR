import React from "react";

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
  ...props
}) {
  const baseClasses =
    "relative inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border-0 font-semibold text-base cursor-pointer transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#db602c]/20 focus-visible:ring-offset-2 disabled:opacity-55 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "text-white bg-[#db602c] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 disabled:hover:shadow-lg",
    secondary:
      "text-k-dark-grey bg-white border-2 border-[#db602c] shadow-md hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:bg-white",
    link: "text-[#db602c] bg-transparent p-0 h-auto font-medium shadow-none hover:text-k-dark-grey hover:underline",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${
        loading ? "pointer-events-none" : ""
      }`}
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
