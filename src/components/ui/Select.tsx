import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-blockchain-accent">
          {label}
        </label>
      )}
      <select
        className={`
          px-4 py-2 rounded-lg
          bg-blockchain-light text-white
          border border-blockchain-accent/30
          hover:border-blockchain-accent/50
          focus:outline-none focus:ring-2 focus:ring-blockchain-accent focus:border-transparent
          transition-all duration-200
          cursor-pointer
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};
