import React from "react";

interface Option {
  label: string;
  value: string | number;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[] | string[];
  containerClassName?: string;
  placeholder?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  containerClassName = "",
  className = "",
  required,
  placeholder,
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block mb-1 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#FFCC00] ${className}`}>
        <select
          className="w-full bg-transparent outline-none"
          required={required}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option, index) => {
            if (typeof option === "string") {
              return (
                <option key={index} value={option}>
                  {option}
                </option>
              );
            }
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default FormSelect;
