import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, prefixText, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        
        <div className="relative flex items-stretch rounded-xl shadow-sm">
          {prefixText && (
            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              {prefixText}
            </span>
          )}
          
          <input
            id={id}
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
              prefixText ? 'rounded-l-none' : ''
            } ${
              error
                ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400'
            } ${className}`}
            {...props}
          />
        </div>

        {error ? (
          <span className="text-xs text-rose-500 font-medium mt-0.5">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
