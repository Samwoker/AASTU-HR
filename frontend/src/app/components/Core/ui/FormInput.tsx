import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  containerClassName = "",
  className = "",
  required,
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block mb-1 font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#FFCC00] ${className}`}>
        {icon && <span className="text-gray-500 mr-2">{icon}</span>}
        <input
          className="w-full bg-transparent outline-none"
          required={required}
          {...props}
        />
      </div>
    </div>
  );
};

export default FormInput;
