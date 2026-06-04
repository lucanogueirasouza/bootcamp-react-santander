import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`glass rounded-2xl p-6 shadow-xl shadow-slate-100/50 dark:shadow-none transition-all duration-300 ${
        hoverEffect
          ? 'hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-0.5'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
