"use client";

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
  required?: boolean;
  error?: string;
  success?: string;
  maxLength?: number;
  inputRef?: (el: HTMLInputElement | null) => void;
  autoComplete?: string;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  required = false,
  error,
  success,
  maxLength,
  inputRef,
  autoComplete,
}: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700 font-heading">
        {label}
        {required && <span className="text-gw-orange ml-1">*</span>}
      </label>
      <input
        ref={inputRef}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`
          w-full px-4 py-3 rounded-xl border-2 text-base transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
            : success
              ? "border-green-400 focus:border-green-500 focus:ring-green-200"
              : "border-gray-200 focus:border-gw-green focus:ring-gw-green/20"
          }
        `}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
    </div>
  );
}
