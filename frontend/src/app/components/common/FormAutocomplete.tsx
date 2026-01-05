import React, { useState, useEffect, useRef } from "react";
// We will adapt the service import later or use props for fetching
// For now, I'll allow passing a fetcher function prop to make it reusable without hardcoding the service here
// if the user strongly prefers the service import I can add it, but passing a prop is cleaner.
// The user provided code imports `employeeService`. I will temporarily comment it out and add a fetcher prop to keep it generic
// or I will implement `getSuggestions` in the component.

interface FormAutocompleteProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type: "departments" | "jobTitles" | "allowanceTypes" | "users"; // Adapted types for our use case
  icon?: React.ReactNode;
  required?: boolean;
  containerClassName?: string;
  // Added prop to fetch suggestions to avoid hardcoding service dependency inside the generic component
  // Or I can stick to the user's pattern if I create the service method.
  // The user said "you can use this code", implying I should use it as is.
  // But I don't have existing `employeeService.getSuggestions`. 
  // I'll stick to the user's code structure but likely swap the service call.
  fetchSuggestionsFn?: (query: string) => Promise<string[]>; 
  onCreateNew?: (query: string) => void;
}

const FormAutocomplete: React.FC<FormAutocompleteProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type, // We might not need 'type' if we pass fetchSuggestionsFn, but keeping it for structure
  icon,
  required,
  containerClassName = "",
  fetchSuggestionsFn,
  onCreateNew
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!fetchSuggestionsFn) return;
    
    setIsLoading(true);
    try {
      const data = await fetchSuggestionsFn(query);
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showSuggestions) {
        fetchSuggestions(value);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, type, showSuggestions]);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      } else if (value && !suggestions.some(s => s.toLowerCase() === value.toLowerCase()) && onCreateNew) {
         onCreateNew(value);
         setShowSuggestions(false);
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
        <label className="block mb-1.5 font-semibold text-k-dark-grey">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`flex items-center w-full h-12 px-4 font-base text-base text-k-dark-grey bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl transition-all duration-200 focus-within:outline-none focus-within:border-orange-200 focus-within:ring-4 focus-within:ring-orange-200 group`}
        onClick={handleToggle}
      >
        {icon && (
          <span className="text-k-medium-grey mr-3 text-lg transition-colors duration-200 group-focus-within:text-k-orange">
            {icon}
          </span>
        )}
        <input
          type="text"
          className="w-full bg-transparent outline-none text-k-dark-grey placeholder:text-k-medium-grey placeholder:opacity-70 font-base"
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
        <div
          className="text-k-medium-grey ml-2 transition-all duration-300 group-hover:text-k-orange cursor-pointer"
        >
          <svg className={`w-5 h-5 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${showSuggestions ? 'rotate-180 text-k-orange' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {showSuggestions && (
        <div className="autocomplete-dropdown absolute gap-1 z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-[fadeInScale_0.2s_ease-out] ring-1 ring-black ring-opacity-5">
          {isLoading ? (
            <div className="px-4 py-8 text-sm text-gray-400 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-k-orange border-t-transparent rounded-full animate-spin"></div>
              <span className="animate-pulse font-medium">Loading suggestions...</span>
            </div>
          ) : (
            <div className="py-2 px-1">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2.5 cursor-pointer transition-all duration-150 flex items-center justify-between rounded-lg ${index === activeIndex || suggestion.toLowerCase() === value.toLowerCase()
                        ? "bg-orange-50 text-k-orange"
                        : "text-k-dark-grey hover:bg-gray-50"
                      }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(suggestion);
                    }}
                  >
                    <span className="font-medium truncate text-sm">{suggestion}</span>
                    {suggestion.toLowerCase() === value.toLowerCase() && (
                      <div className="bg-orange-100 p-1 rounded-full scale-90">
                        <svg className="w-3.5 h-3.5 text-k-orange" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  No matches found
                </div>
              )}

              {value && !suggestions.some(s => s.toLowerCase() === value.toLowerCase()) && onCreateNew && (
                <div 
                  className="mx-1 mt-1 px-3 py-2 rounded-lg border-t border-gray-50 text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50/30 flex items-center gap-2 cursor-pointer hover:bg-orange-50 hover:text-k-orange transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onCreateNew(value);
                    setShowSuggestions(false);
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-300"></div>
                  Create new: <span className="text-gray-600 font-bold">"{value}"</span>
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
