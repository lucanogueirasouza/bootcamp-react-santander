import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percent = Math.min(100, Math.max(0, Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)));

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>Etapa {currentStep} de {totalSteps}</span>
        <span>{percent}% Completo</span>
      </div>
      
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
