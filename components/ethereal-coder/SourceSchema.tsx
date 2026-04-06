"use client";

import { useRef } from "react";
import {
  CloudUpload,
  Database,
  Smartphone,
  FileCode2,
  Zap,
  CircleCheck,
  X,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useGenerate } from "@/components/GenerateContext";
import type { GenerationTarget } from "@/types/schema";

interface OutputTarget {
  label: string;
  value: GenerationTarget;
  icon: React.ReactNode;
  description: string;
}

const outputTargets: OutputTarget[] = [
  {
    label: "Prisma ORM",
    value: "prisma",
    icon: <Database className="w-5 h-5" />,
    description: "schema.prisma",
  },
  {
    label: "Flutter Models",
    value: "flutter",
    icon: <Smartphone className="w-5 h-5" />,
    description: "Dart class + fromJson/toJson",
  },
  {
    label: "TypeScript Interface",
    value: "typescript",
    icon: <FileCode2 className="w-5 h-5" />,
    description: "interface + Create DTO",
  },
];

const SourceSchema = () => {
  const {
    uploadedFile,
    selectedTargets,
    isLoading,
    error,
    result,
    setUploadedFile,
    toggleTarget,
    generate,
    reset,
  } = useGenerate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileSelect = (file: File) => {
    const valid = file.name.endsWith(".sql") || file.name.endsWith(".json");
    if (!valid) {
      alert("Only .sql and .json files are supported");
      return;
    }
    setUploadedFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="flex-1 flex flex-col gap-6 max-w-md">
      {/* Section Header */}
      <header>
        <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">
          Source Schema
        </h2>
        <h1 className="text-3xl font-black font-[Manrope] text-slate-900 leading-none">
          Blueprint Input
        </h1>
      </header>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* File Upload Area */}
      {!uploadedFile ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 rounded-xl flex flex-col items-center justify-center p-12
            transition-all duration-300 cursor-pointer group
            border-2 border-dashed border-slate-300 bg-slate-50/50
            hover:border-blue-400 hover:bg-blue-50/50 min-h-[200px]"
        >
          <CloudUpload className="w-12 h-12 mb-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" />
          <div className="text-slate-600 font-semibold text-center">
            Drop your <span className="text-blue-600 font-bold">.sql</span> or{" "}
            <span className="text-blue-600 font-bold">.json</span> here
          </div>
          <div className="text-slate-400 text-xs mt-2">
            or click to browse — max 10MB
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".sql,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
          />
        </div>
      ) : (
        /* File Preview Card */
        <div className="flex-1 rounded-xl bg-white ring-1 ring-blue-200 shadow-md shadow-blue-500/5 p-5 flex flex-col gap-3 min-h-[200px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm truncate max-w-[200px]">
                  {uploadedFile.name}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {formatFileSize(uploadedFile.size)}
                </div>
              </div>
            </div>
            <button
              onClick={reset}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success summary */}
          {result?.summary && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                { label: "Tables", value: result.summary.tablesFound },
                { label: "Relations", value: result.summary.relationsFound },
                { label: "Files", value: result.summary.filesGenerated },
                { label: "Targets", value: result.summary.targets.length },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-blue-50 rounded-lg px-3 py-2 text-center"
                >
                  <div className="text-lg font-black text-blue-600">
                    {s.value}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Output Targets — multi-select */}
      <div className="space-y-3">
        <label className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
          Output Target
        </label>
        <div className="grid grid-cols-1 gap-3">
          {outputTargets.map((target) => {
            const isSelected = selectedTargets.includes(target.value);
            return (
              <button
                key={target.value}
                onClick={() => toggleTarget(target.value)}
                disabled={isLoading}
                className={`
                  p-4 rounded-xl flex items-center justify-between
                  transition-all duration-200 cursor-pointer w-full text-left
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isSelected
                    ? "bg-white ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/5"
                    : "bg-slate-50 hover:bg-slate-100"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={isSelected ? "text-blue-600" : "text-slate-400"}>
                    {target.icon}
                  </span>
                  <div>
                    <div className={`text-sm ${isSelected ? "font-bold text-slate-900" : "font-semibold text-slate-600"}`}>
                      {target.label}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {target.description}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <CircleCheck className="w-6 h-6 fill-blue-600 text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generate}
        disabled={isLoading || !uploadedFile || selectedTargets.length === 0}
        className="w-full bg-linear-to-r from-blue-600 to-blue-500 text-white py-5 rounded-xl
          font-bold text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3
          hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Code...
          </>
        ) : result ? (
          <>
            <Zap className="w-5 h-5 fill-white" />
            Re-generate
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 fill-white" />
            Generate Code
          </>
        )}
      </button>
    </section>
  );
};

export default SourceSchema;
