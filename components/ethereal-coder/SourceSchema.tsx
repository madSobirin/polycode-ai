"use client";

import { useState } from "react";
import {
  CloudUpload,
  Database,
  Smartphone,
  FileCode2,
  Zap,
  CircleCheck,
} from "lucide-react";

interface OutputTarget {
  label: string;
  icon: React.ReactNode;
}

const outputTargets: OutputTarget[] = [
  {
    label: "Prisma ORM",
    icon: <Database className="w-5 h-5" />,
  },
  {
    label: "Flutter Models",
    icon: <Smartphone className="w-5 h-5" />,
  },
  {
    label: "TypeScript Interface",
    icon: <FileCode2 className="w-5 h-5" />,
  },
];

const SourceSchema = () => {
  const [selectedTarget, setSelectedTarget] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <section className="flex-1 flex flex-col gap-8 max-w-md">
      {/* Section Header */}
      <header>
        <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">
          Source Schema
        </h2>
        <h1 className="text-3xl font-black font-[Manrope] text-slate-900 leading-none">
          Blueprint Input
        </h1>
      </header>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        className={`
          flex-1 rounded-xl flex flex-col items-center justify-center p-12
          transition-all duration-300 cursor-pointer group
          border-3 border-dashed
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50"
          }
        `}
      >
        <CloudUpload
          className={`w-12 h-12 mb-4 transition-colors duration-300 ${
            isDragOver
              ? "text-blue-500"
              : "text-slate-400 group-hover:text-blue-500"
          }`}
        />
        <div className="text-slate-600 font-semibold text-center">
          Drop your <span className="text-blue-600 font-bold">.sql</span> or{" "}
          <span className="text-blue-600 font-bold">.json</span> here
        </div>
        <div className="text-slate-400 text-xs mt-2">
          Maximum file size: 10MB
        </div>
      </div>

      {/* Output Targets */}
      <div className="space-y-3">
        <label className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
          Output Target
        </label>
        <div className="grid grid-cols-1 gap-3">
          {outputTargets.map((target, index) => {
            const isSelected = index === selectedTarget;
            return (
              <button
                key={target.label}
                onClick={() => setSelectedTarget(index)}
                className={`
                  p-4 rounded-xl flex items-center justify-between
                  transition-all duration-200 cursor-pointer w-full text-left
                  ${
                    isSelected
                      ? "bg-white ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/5"
                      : "bg-slate-50 hover:bg-slate-100"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={isSelected ? "text-blue-600" : "text-slate-400"}
                  >
                    {target.icon}
                  </span>
                  <span
                    className={`text-sm ${
                      isSelected
                        ? "font-bold text-slate-900"
                        : "font-semibold text-slate-600"
                    }`}
                  >
                    {target.label}
                  </span>
                </div>
                {isSelected && (
                  <CircleCheck className="w-6 h-6 fill-blue-600 text-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Button */}
      <button className="w-full bg-linear-to-r from-blue-600 to-blue-500 text-white py-5 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
        <Zap className="w-5 h-5 fill-white" />
        Generate Code
      </button>
    </section>
  );
};

export default SourceSchema;
