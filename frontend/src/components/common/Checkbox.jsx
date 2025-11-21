import React from "react";

export default function Checkbox({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  ...props
}) {
  return (
    <div className="flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="absolute opacity-0 w-0 h-0 peer"
        {...props}
      />
      <label
        htmlFor={name}
        className="flex items-center gap-3 cursor-pointer select-none text-sm text-k-dark-grey peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
      >
        <span className="relative flex items-center justify-center w-5 h-5 border-2 border-k-medium-grey rounded bg-white transition-all duration-200 peer-checked:bg-k-orange peer-checked:border-k-orange peer-focus:ring-2 peer-focus:ring-orange-400 peer-focus:ring-offset-2">
          <svg
            className={`w-4 h-4 text-black transition-all duration-200 ${
              checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="font-normal">{label}</span>
      </label>
    </div>
  );
}
