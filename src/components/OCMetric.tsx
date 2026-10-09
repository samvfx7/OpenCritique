import React from 'react';

interface OCMetricProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export const OCMetric: React.FC<OCMetricProps> = ({ value, label, icon, className = '' }) => {
  return (
    <div className={`p-4 flex flex-col items-center justify-center gap-1 text-center ${className}`}>
      {icon && <div className="text-[#A7A3AF] mb-1">{icon}</div>}
      <span className="text-2xl font-semibold text-[#F5F3F8] tracking-tight">{value}</span>
      <span className="text-xs text-[#A7A3AF] font-medium">{label}</span>
    </div>
  );
};
