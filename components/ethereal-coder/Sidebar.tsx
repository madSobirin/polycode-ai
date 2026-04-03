"use client";

import { useState } from "react";
import { Blocks, FolderOpen, History, Settings, Sparkles } from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: "Generator",
    icon: <Blocks className="w-5 h-5" />,
    href: "#",
  },
  {
    label: "Projects",
    icon: <FolderOpen className="w-5 h-5" />,
    href: "#",
  },
  {
    label: "History",
    icon: <History className="w-5 h-5" />,
    href: "#",
  },
  {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "#",
  },
];

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <aside className="flex flex-col h-full p-4 gap-2 bg-slate-50 border-r border-slate-200/60 w-64 shrink-0">
      {/* Logo / Brand */}
      <div className="mb-8 px-2">
        <div className="text-lg font-bold text-slate-800 font-[Manrope] tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          PolyCode AI
        </div>
        <div className="text-xs text-slate-500 font-medium pl-7">
          AI Engine v1.0
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(index);
              }}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                font-[Manrope] text-sm font-semibold
                transition-all duration-200 hover:translate-x-1
                ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                    : "text-slate-500 hover:bg-slate-200/60"
                }
              `}
            >
              <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                {item.icon}
              </span>
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Upgrade Card */}
      <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="text-xs font-bold mb-2">Upgrade to Pro</div>
        <div className="text-[10px] opacity-90 mb-3 leading-relaxed">
          Unlock unlimited schema complexity and cloud exports.
        </div>
        <button className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-lg text-xs font-bold backdrop-blur-sm cursor-pointer">
          Learn More
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
