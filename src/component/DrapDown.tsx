import { useState, useEffect, useRef } from "react";

interface DropdownOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue?: string | number;
  onSelect: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  name?: string; 
  required?: boolean; 
}

const Dropdown = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  label,
  name,
  required = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (value: string | number) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <button
        type="button"
        id={name}
        name={name}
        onClick={toggleDropdown}
        disabled={disabled}
        className={`w-full flex justify-between items-center px-4 py-2 text-sm font-medium rounded-sm border shadow-sm
          ${
            disabled
              ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-400 dark:text-gray-500"
              : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300"
          }
          border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
      >
        <span className="flex items-center truncate">
          {selectedOption?.icon && (
            <span className="mr-2">{selectedOption.icon}</span>
          )}
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute z-[15] mt-1 w-full rounded-md shadow-lg overflow-hidden
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}
        >
          <ul
            className="max-h-60 overflow-auto py-1 text-base focus:outline-none"
            role="listbox"
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`flex items-center px-4 py-2 text-sm cursor-pointer select-none
                  ${
                    option.value === selectedValue
                      ? "bg-indigo-100 dark:bg-gray-700/15 text-red-700 dark:text-red-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-red-700"
                  }`}
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;