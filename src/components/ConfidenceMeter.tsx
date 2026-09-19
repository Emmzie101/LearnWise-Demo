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
    { rating: 1, label: 'Not sure' },
    { rating: 2, label: 'A little unsure' },
    { rating: 3, label: 'Somewhat sure' },
    { rating: 4, label: 'Fairly sure' },
    { rating: 5, label: 'Very sure' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span className="font-medium text-[#10233F]">How sure are you?</span>
        <span className="text-[#176FF5] font-semibold">
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
                  ? 'bg-[#176FF5] text-white shadow-sm ring-2 ring-[#176FF5]/30'
                  : 'bg-[#EDF5FF]/70 hover:bg-[#EDF5FF] text-[#10233F]/80 border border-[#176FF5]/15'
              } ${readOnly ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
            >
              <span className="block text-sm font-bold font-heading">{l.rating}</span>
              <span className="hidden sm:block text-[10px] truncate">{l.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-[#8A96A8] px-1">
        <span>Not sure</span>
        <span>Very sure</span>
      </div>

      {calibrationStatus && (
        <div className="pt-1">
          {calibrationStatus === 'well_calibrated' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>Great judgment:</strong> Your confidence matched your actual test result.</span>
            </div>
          )}
          {calibrationStatus === 'overconfident' && (
            <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span><strong>Familiarity trap:</strong> The idea felt familiar, but you weren't fully confident. Testing without notes will solidify this.</span>
            </div>
          )}
          {calibrationStatus === 'underconfident' && (
            <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span><strong>You knew it:</strong> You got it right even though you doubted yourself. Trust your knowledge!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
