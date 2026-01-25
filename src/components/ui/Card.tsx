import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-blockchain-medium border border-blockchain-accent/20',
    bordered: 'bg-blockchain-light border-2 border-blockchain-accent shadow-glow-sm',
    elevated: 'bg-blockchain-medium shadow-glow',
  };

  return (
    <div
      className={`rounded-lg p-4 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
