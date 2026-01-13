import React, { useState, useEffect, useRef } from "react";
import employeeService from "../../../services/employeeService";
import LoadingScreen from "./LoadingScreen";

interface FormAutocompleteProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type:
    | "departments"
    | "jobTitles"
    | "jobLevels"
    | "fieldsOfStudy"
    | "institutions"
    | "employees"
    | "managers";
  onIdChange?: (id: string) => void;
  icon?: React.ReactNode;
  required?: boolean;
  error?: string;
  containerClassName?: string;
}

const FormAutocomplete: React.FC<FormAutocompleteProps> = ({
  label,
  value,
  onChange,
  onIdChange,
  placeholder,
  type,
  icon,
  required,
  error,
  containerClassName = "",
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await employeeService.getSuggestions(type as any, query);
      if (response.data.status === "success") {
        const data = response.data.data;
        if (type === "employees") {
          // The assign-managers/search returns { employees: [] }
          setSuggestions(data.employees || []);
        } else if (type === "managers") {
          // The assign-managers/existing-managers returns { managers: [] }
          setSuggestions(data.managers || []);
        } else {
          // Depending on the backend, suggestions may be an array or wrapped in an object.
          if (Array.isArray(data)) {
            setSuggestions(data);
          } else if (type === "departments") {
            setSuggestions(data?.departments || data?.department || []);
          } else if (type === "jobTitles") {
            setSuggestions(data?.jobTitles || data?.job_titles || []);
          } else if (type === "jobLevels") {
            setSuggestions(data?.jobLevels || data?.job_levels || []);
          } else {
            setSuggestions([]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestionLabel = (suggestion: any): string => {
    if (typeof suggestion === "string") return suggestion;
    if (!suggestion) return "";

    // Employees/managers
    if (type === "employees" || type === "managers") {
      return suggestion.full_name ?? suggestion.name ?? "";
    }

    // Reference data
    if (type === "departments") {
      return suggestion.name ?? "";
    }
    if (type === "jobTitles") {
      return suggestion.title ?? suggestion.name ?? "";
    }
    if (type === "jobLevels") {
      return suggestion.level ?? suggestion.name ?? "";
    }

    // Generic fallback
    return (
      suggestion.name ??
      suggestion.title ??
      suggestion.level ??
      suggestion.full_name ??
      ""
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showSuggestions) {
        fetchSuggestions(value);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, type, showSuggestions]);

  const handleSelect = (suggestion: any) => {
    const labelStr = getSuggestionLabel(suggestion);
    if (labelStr) {
      onChange(labelStr);
    }
    const id =
      typeof suggestion === "object" && suggestion != null
        ? suggestion.id ?? suggestion._id
        : undefined;
    if (onIdChange && id != null) onIdChange(String(id));
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      } else {
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showSuggestions) {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
      fetchSuggestions(value);
    }
  };

  return (
    <div className={`relative ${containerClassName}`} ref={wrapperRef}>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.98) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .autocomplete-dropdown::-webkit-scrollbar {
          width: 5px;
        }
        .autocomplete-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .autocomplete-dropdown::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .autocomplete-dropdown::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>

      {label && (
        <label className="text-sm font-medium text-k-dark-grey mb-1">
          {label} {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <div
        className={`flex items-center w-full h-12 px-4 bg-white/70 backdrop-blur-sm border rounded-xl transition-all duration-200 focus-within:border-orange-200 focus-within:ring-4 focus-within:ring-orange-200 group cursor-pointer ${
          error ? "border-error" : "border-gray-200"
        }`}
        onClick={handleToggle}
      >
        {icon && (
          <span className="text-k-medium-grey mr-3 text-lg transition-colors duration-200 group-focus-within:text-[#DB5E00]">
            {icon}
          </span>
        )}
        <input
          type="text"
          className="w-full h-full bg-transparent outline-none text-k-dark-grey placeholder:text-k-medium-grey placeholder:opacity-70 font-base text-base"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!showSuggestions) setShowSuggestions(true);
          }}
          onFocus={() => {
            if (!showSuggestions) {
              setShowSuggestions(true);
              fetchSuggestions(value);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
        />
        <div className="text-k-medium-grey ml-2 transition-all duration-300 group-hover:text-[#DB5E00] cursor-pointer">
          <svg
            className={`w-5 h-5 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
              showSuggestions ? "rotate-180 text-[#DB5E00]" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {showSuggestions && (
        <div className="autocomplete-dropdown absolute gap-1 z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-[fadeInScale_0.2s_ease-out] ring-1 ring-gray-200">
          {isLoading ? (
            <div className="px-4 py-6">
              <LoadingScreen
                size={40}
                showText={true}
                className="flex items-center justify-center p-0"
              />
            </div>
          ) : (
            <div className="py-2 px-1">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => {
                  const isString = typeof suggestion === "string";
                  const labelStr = isString
                    ? suggestion
                    : getSuggestionLabel(suggestion);
                  const isActive =
                    index === activeIndex ||
                    labelStr.toLowerCase() === value.toLowerCase();
                  const subLabel =
                    !isString && (type === "employees" || type === "managers")
                      ? `${suggestion.job_title || ""} • ${
                          suggestion.department || ""
                        }`
                      : null;

                  return (
                    <div
                      key={index}
                      className={`px-4 py-2.5 cursor-pointer transition-all duration-150 flex items-center justify-between rounded-lg ${
                        isActive
                          ? "bg-orange-50 text-[#DB5E00]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(suggestion);
                      }}
                    >
                      <div className="flex flex-col truncate">
                        <span className="font-medium text-sm truncate">
                          {labelStr}
                        </span>
                        {subLabel && (
                          <span className="text-[10px] text-gray-400 truncate opacity-80">
                            {subLabel}
                          </span>
                        )}
                      </div>
                      {labelStr.toLowerCase() === value.toLowerCase() && (
                        <div className="bg-orange-100 p-1 rounded-full scale-90 ml-2 shrink-0">
                          <svg
                            className="w-3.5 h-3.5 text-[#DB5E00]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  No matches found
                </div>
              )}

              {value &&
                suggestions.length > 0 &&
                typeof suggestions[0] === "string" &&
                !suggestions.some(
                  (s) => s.toLowerCase() === value.toLowerCase()
                ) && (
                  <div className="mx-1 mt-1 px-3 py-2 rounded-lg border-t border-gray-50 text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50/30 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-300"></div>
                    Custom entry:{" "}
                    <span className="text-gray-600">"{value}"</span>
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormAutocomplete;
