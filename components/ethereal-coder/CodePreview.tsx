"use client";

import { useState } from "react";
import {
  Copy,
  Download,
  Check,
  Loader2,
  FileCode,
  Sparkles,
} from "lucide-react";
import { useGenerate } from "@/components/GenerateContext";
import type { GeneratedFile } from "@/types/schema";

/* ─── Simple syntax highlighter ─── */
function highlightCode(code: string, filename: string): React.ReactNode {
  const lines = code.split("\n");
  const isPrisma = filename.endsWith(".prisma");
  const isDart = filename.endsWith(".dart");
  const isTs = filename.endsWith(".ts");

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="select-none w-10 shrink-0 text-slate-600 text-right pr-4 text-[11px] leading-relaxed">
            {i + 1}
          </span>
          <span
            className={`flex-1 whitespace-pre ${getLineClass(line, isPrisma, isDart, isTs)}`}
          >
            {line || " "}
          </span>
        </div>
      ))}
    </div>
  );
}

function getLineClass(
  line: string,
  isPrisma: boolean,
  isDart: boolean,
  isTs: boolean
): string {
  const trimmed = line.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("*"))
    return "text-slate-500 italic";
  if (isPrisma) {
    if (/^(model|datasource|generator|enum)\s/.test(trimmed))
      return "text-purple-400 font-semibold";
    if (/^@/.test(trimmed)) return "text-amber-400";
  }
  if (isDart) {
    if (/^(class|final|required|factory|return)\b/.test(trimmed))
      return "text-purple-400 font-semibold";
  }
  if (isTs) {
    if (/^(export|interface|type|import)\b/.test(trimmed))
      return "text-purple-400 font-semibold";
  }
  return "text-white/90";
}

/* ─── Empty state ────────────────────────────────────────────────────────── */
const EmptyState = ({ isLoading }: { isLoading: boolean }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
    {isLoading ? (
      <>
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        <div>
          <div className="text-white/80 font-bold text-lg">
            AI is working...
          </div>
          <div className="text-slate-500 text-sm mt-1">
            Parsing schema and generating code
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-slate-500" />
        </div>
        <div>
          <div className="text-white/40 font-bold text-lg">
            No output yet
          </div>
          <div className="text-slate-600 text-sm mt-1">
            Upload a schema and click Generate to see results here
          </div>
        </div>
      </>
    )}
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
const CodePreview = () => {
  const { result, isLoading, activeTab, setActiveTab, copyToClipboard, download } =
    useGenerate();

  const [viewMode, setViewMode] = useState<"editor" | "docs">("editor");
  const [copied, setCopied] = useState(false);

  const files: GeneratedFile[] = result?.files ?? [];
  const activeFile = files.find((f) => f.filename === activeTab) ?? files[0];

  const handleCopy = async () => {
    if (!activeFile) return;
    await copyToClipboard(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="flex-1 flex flex-col gap-6 min-h-[500px] xl:min-h-0 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <header>
          <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">
            Generated Code
          </h2>
          <h1 className="text-3xl font-black font-[Manrope] text-slate-900 leading-none">
            Output Preview
          </h1>
        </header>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          {(["editor", "docs"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer capitalize ${
                viewMode === mode
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5 min-h-0 min-w-0">
        {/* macOS-style title bar */}
        <div className="h-12 bg-[#2d2d2d] flex items-center px-4 justify-between shrink-0 overflow-x-auto">
          {/* Traffic lights */}
          <div className="hidden sm:flex gap-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* File tabs — from real result or placeholders */}
          <div className="flex gap-px overflow-x-auto flex-1 hide-scrollbar">
            {files.length > 0 ? (
              files.map((file) => (
                <button
                  key={file.filename}
                  onClick={() => setActiveTab(file.filename)}
                  className={`px-4 py-3 text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    file.filename === activeTab
                      ? "bg-[#1e1e1e] text-white border-t-2 border-blue-500"
                      : "bg-[#2d2d2d] text-slate-500 hover:bg-[#3d3d3d]"
                  }`}
                >
                  {file.filename}
                </button>
              ))
            ) : (
              <span className="px-4 py-3 text-[11px] text-slate-600 whitespace-nowrap">
                Waiting for generation...
              </span>
            )}
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-4 shrink-0 bg-[#2d2d2d] pl-4">
            <button
              onClick={handleCopy}
              disabled={!activeFile}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer disabled:opacity-30"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Code content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto bg-[#1e1e1e]">
          {viewMode === "editor" ? (
            activeFile ? (
              highlightCode(activeFile.content, activeFile.filename)
            ) : (
              <EmptyState isLoading={isLoading} />
            )
          ) : (
            /* Docs view — summary table */
            <div className="text-white/90">
              {result ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-blue-400 font-bold text-sm mb-3 uppercase tracking-widest">
                      Generation Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Tables Found", value: result.summary.tablesFound },
                        { label: "Relations", value: result.summary.relationsFound },
                        { label: "Files Generated", value: result.summary.filesGenerated },
                        { label: "Targets", value: result.summary.targets.join(", ") },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-white/5 rounded-lg p-3"
                        >
                          <div className="text-slate-400 text-[11px] uppercase tracking-widest mb-1">
                            {item.label}
                          </div>
                          <div className="text-white font-bold text-lg">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-blue-400 font-bold text-sm mb-3 uppercase tracking-widest">
                      Generated Files
                    </h3>
                    <div className="space-y-2">
                      {files.map((f) => (
                        <div
                          key={f.filename}
                          className="flex items-center gap-2 bg-white/5 rounded-lg p-3"
                        >
                          <FileCode className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="font-mono text-sm text-white/80">
                            {f.target}/{f.filename}
                          </span>
                          <span className="ml-auto text-slate-500 text-xs">
                            {f.content.split("\n").length} lines
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState isLoading={isLoading} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={download}
        disabled={!result}
        className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl
          font-bold text-sm tracking-wide flex items-center justify-center gap-2
          transition-colors cursor-pointer shadow-lg
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        {result
          ? `Download All (.zip) — ${result.summary.filesGenerated} files`
          : "Download All (.zip)"}
      </button>
    </section>
  );
};

export default CodePreview;
