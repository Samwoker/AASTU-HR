import React from "react";
import { MdArrowDropDown } from "react-icons/md";

export default function FormField({
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
  options = [], // For select type
  children, // For select options if passed as children
  className = "",
  inputClassName = "",
  ...props
}) {
  const baseInputClasses = `w-full h-12 px-4 font-base text-base text-k-dark-grey bg-white/70 backdrop-blur-sm border rounded-xl transition-all duration-200 placeholder:text-k-medium-grey placeholder:opacity-70 focus:outline-none ${
    error
      ? "border-error focus:border-error focus:ring-4 focus:ring-red-200"
      : "border-gray-200 focus:border-orange-200 focus:ring-4 focus:ring-orange-200"
  }`;

  const renderInput = () => {
    if (type === "select") {
      return (
        <div className="relative">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`${baseInputClasses} ${inputClassName} appearance-none cursor-pointer ${
              Icon ? "pl-11" : ""
            }`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={helperText ? `${name}-helper` : undefined}
            {...props}
          >
            {children ||
              options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-k-medium-grey pointer-events-none">
            <MdArrowDropDown size={24} />
          </div>
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseInputClasses} ${inputClassName} py-3 h-auto min-h-[100px] resize-y`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={helperText ? `${name}-helper` : undefined}
          {...props}
        />
      );
    }

    return (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onClick={(e) => type === "date" && e.target.showPicker?.()}
        className={`${baseInputClasses} ${inputClassName} ${Icon ? "pl-11" : ""} ${
          type === "date" ? "cursor-pointer" : ""
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={helperText ? `${name}-helper` : undefined}
        {...props}
      />
    );
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-k-dark-grey mb-1"
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center text-k-medium-grey pointer-events-none z-10">
            <Icon />
          </div>
        )}
        {renderInput()}
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

