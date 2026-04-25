import React from 'react';

interface PillTabsProps {
  items: string[];
  active: string;
  onChange: (value: string) => void;
  className?: string; // Optional: buat nambah spacing dari luar
}

export const PillTabs: React.FC<PillTabsProps> = ({ 
  items, 
  active, 
  onChange, 
  className = "" 
}) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-xl bg-fd-accent p-1 text-fd-foreground ${className}`}>
      {items.map((item) => {
        const isActive = active === item;
        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            type="button"
            className={`
              inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
              ${isActive 
                ? "bg-fd-background text-fd-foreground elevation-sm" 
                : ""
              }
            `}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
};
