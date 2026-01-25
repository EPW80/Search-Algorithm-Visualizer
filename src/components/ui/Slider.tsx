import React from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  showValue = false,
  className = '',
  value,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-sm font-medium text-blockchain-accent">
              {label}
            </label>
          )}
          {showValue && value !== undefined && (
            <span className="text-sm text-primary-300">{value}</span>
          )}
        </div>
      )}
      <input
        type="range"
        value={value}
        className={`
          w-full h-2 rounded-lg appearance-none cursor-pointer
          bg-blockchain-light
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-blockchain-accent
          [&::-webkit-slider-thumb]:shadow-glow-sm
          [&::-webkit-slider-thumb]:hover:shadow-glow
          [&::-webkit-slider-thumb]:transition-shadow
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-blockchain-accent
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:shadow-glow-sm
          [&::-moz-range-thumb]:hover:shadow-glow
          [&::-moz-range-thumb]:transition-shadow
          ${className}
        `}
        {...props}
      />
    </div>
  );
};
