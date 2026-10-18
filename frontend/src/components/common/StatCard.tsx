import React from 'react';
import { TooltipHelp } from './TooltipHelp';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  tooltipText?: string;
  badge?: {
    text: string;
    variant: 'low' | 'moderate' | 'high' | 'very_high' | 'info';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  tooltipText,
  badge,
}) => {
  const getBadgeStyle = (variant: string) => {
    switch (variant) {
      case 'low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'moderate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'very_high':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="tech-card p-4 rounded-xl flex flex-col justify-between transition-all hover:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-slate-400 text-xs font-medium uppercase tracking-wider">
          <span>{label}</span>
          {tooltipText && <TooltipHelp text={tooltipText} title={label} />}
        </div>
        {icon && <div className="text-cyan-400 bg-cyan-500/10 p-2 rounded-lg">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="text-2xl font-bold font-mono text-slate-100">{value}</div>
        {badge && (
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${getBadgeStyle(badge.variant)}`}>
            {badge.text}
          </span>
        )}
      </div>

      {subtext && <div className="text-xs text-slate-400 mt-2">{subtext}</div>}
    </div>
  );
};
