export default function Button({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  const baseStyles =
    "px-4 py-2 rounded-xl font-semibold transition focus:ring-2 focus:ring-offset-1";

  const variants = {
    default: "bg-[#FFCC00] hover:bg-[#e6b800] text-black shadow",
    outline: "border border-gray-400 hover:bg-gray-100 text-gray-700",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow",
    success: "bg-green-600 hover:bg-green-700 text-white shadow",
    subtle: "bg-gray-200 hover:bg-gray-300 text-gray-700",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
