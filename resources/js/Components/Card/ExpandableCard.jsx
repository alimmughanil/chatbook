import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ExpandableCard = ({ children, maxHeight = "200px", className = "", buttonShowText = "Baca Selengkapnya", buttonHiddenText = "Sembunyikan", wrapperClassName = null, isShadow = true}) => {
  if (!children) return null;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-[5000px]" : ""}`}
        style={{ maxHeight: isExpanded ? '5000px' : maxHeight }}
      >
        <div className={wrapperClassName ?? "text-gray-700 leading-relaxed text-sm md:text-base"}>
          {children}
        </div>

        {!isExpanded && isShadow && (
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />
        )}
      </div>

      <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-1 font-bold text-[#6017BE] mt-2 hover:opacity-80 transition-opacity">
        <span className="text-sm">
          {isExpanded ? buttonHiddenText : buttonShowText}
        </span>
        <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
};

export default ExpandableCard;