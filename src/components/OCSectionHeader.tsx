import React from 'react';

interface OCSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const OCSectionHeader: React.FC<OCSectionHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`w-full flex flex-col mb-3 ${className}`}>
      <div className="w-full flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#F5F3F8] tracking-tight">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      {subtitle && <p className="text-xs text-[#A7A3AF] mt-1">{subtitle}</p>}
    </div>
  );
};
