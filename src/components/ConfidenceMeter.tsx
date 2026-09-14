import React from 'react';

interface ConfidenceMeterProps {
  value: 1 | 2 | 3 | 4 | 5;
  onChange?: (val: 1 | 2 | 3 | 4 | 5) => void;
  readOnly?: boolean;
  calibrationStatus?: 'well_calibrated' | 'overconfident' | 'underconfident';
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  value,
  onChange,
  readOnly = false,
  calibrationStatus,
}) => {
  const levels: { rating: 1 | 2 | 3 | 4 | 5; label: string }[] = [
    { rating: 1, label: 'Very Unsure' },
    { rating: 2, label: 'Unsure' },
    { rating: 3, label: 'Somewhat Confident' },
    { rating: 4, label: 'Confident' },
    { rating: 5, label: 'Very Confident' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span className="font-medium text-[#071A3A]">How confident are you in this answer?</span>
        <span className="text-[#124BCE] font-semibold">
          {levels.find(l => l.rating === value)?.label || `${value}/5`}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {levels.map(l => {
          const isSelected = value === l.rating;
          return (
            <button
              type="button"
              key={l.rating}
              disabled={readOnly}
              onClick={() => onChange && onChange(l.rating)}
              className={`py-2 px-1 text-center rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#124BCE] text-white shadow-md shadow-[#124BCE]/25 ring-2 ring-[#1769FF]/40'
                  : 'bg-[#EAF2FF]/60 hover:bg-[#EAF2FF] text-[#071A3A]/80 border border-[#1769FF]/15'
              } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="block text-sm font-bold font-heading">{l.rating}</span>
              <span className="hidden sm:block text-[10px] truncate">{l.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {calibrationStatus && (
        <div className="pt-1">
          {calibrationStatus === 'well_calibrated' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span><strong>Well Calibrated:</strong> Your confidence accurately predicted your test outcome.</span>
            </div>
          )}
          {calibrationStatus === 'overconfident' && (
            <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span><strong>Overconfident (Illusion of Fluency):</strong> High confidence despite an incorrect response. Passive familiarity was mistaken for operational recall.</span>
            </div>
          )}
          {calibrationStatus === 'underconfident' && (
            <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span><strong>Underconfident:</strong> You got the answer right despite doubting your memory. Trust your encoding foundation!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
