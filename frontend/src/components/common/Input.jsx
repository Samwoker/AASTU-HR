import React from "react";

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  icon: Icon,
  ...props
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-k-dark-grey mb-1"
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 flex items-center text-k-medium-grey pointer-events-none z-10">
            <Icon />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-12 px-4 ${
            Icon ? "pl-11" : ""
          } font-base text-base text-k-dark-grey bg-white/70 backdrop-blur-sm border rounded-xl transition-all duration-200 placeholder:text-k-medium-grey placeholder:opacity-70 focus:outline-none ${
            error
              ? "border-error focus:border-error focus:ring-4 focus:ring-red-200"
              : "border-gray-200 focus:border-k-orange focus:ring-4 focus:ring-orange-300"
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={helperText ? `${name}-helper` : undefined}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <span
          id={`${name}-helper`}
          className={`text-sm ${error ? "text-error" : "text-k-medium-grey"}`}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
}
