"use client";

import { useState } from "react";
import { Copy, Search, Download } from "lucide-react";

interface CodeTab {
  label: string;
  content: React.ReactNode;
}

/* ─── Syntax color classes ─── */
const kw = "text-purple-400"; // keyword
const str = "text-green-400"; // string
const fn = "text-blue-400"; // function
const cmt = "text-slate-500"; // comment

const prismaCode = (
  <>
    <div>
      <span className={kw}>datasource</span> db {"{"}
    </div>
    <div className="pl-6">
      provider = <span className={str}>&quot;postgresql&quot;</span>
    </div>
    <div className="pl-6">
      url &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span className={fn}>env</span>(
      <span className={str}>&quot;DATABASE_URL&quot;</span>)
    </div>
    <div>{"}"}</div>

    <div className="mt-4">
      <span className={kw}>generator</span> client {"{"}
    </div>
    <div className="pl-6">
      provider = <span className={str}>&quot;prisma-client-js&quot;</span>
    </div>
    <div>{"}"}</div>

    <div className="mt-4">
      <span className={kw}>model</span> <span className={fn}>User</span> {"{"}
    </div>
    <div className="pl-6">
      id &nbsp;&nbsp;&nbsp;<span className={kw}>String</span> &nbsp;@id
      @default(
      <span className={fn}>uuid</span>())
    </div>
    <div className="pl-6">
      email <span className={kw}>String</span> &nbsp;@unique
    </div>
    <div className="pl-6">
      name &nbsp;<span className={kw}>String</span>?
    </div>
    <div className="pl-6">
      posts <span className={fn}>Post</span>[]
    </div>
    <div className="pl-6">
      <span className={cmt}>{"// Tracking fields"}</span>
    </div>
    <div className="pl-6">
      createdAt <span className={kw}>DateTime</span> @default(
      <span className={fn}>now</span>())
    </div>
    <div>{"}"}</div>

    <div className="mt-4">
      <span className={kw}>model</span> <span className={fn}>Post</span> {"{"}
    </div>
    <div className="pl-6">
      id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span className={kw}>Int</span> &nbsp;&nbsp;&nbsp;&nbsp;@id @default(
      <span className={fn}>autoincrement</span>())
    </div>
    <div className="pl-6">
      title &nbsp;&nbsp;&nbsp;&nbsp;<span className={kw}>String</span>
    </div>
    <div className="pl-6">
      content &nbsp;&nbsp;<span className={kw}>String</span>?
    </div>
    <div className="pl-6">
      published <span className={kw}>Boolean</span> @default(
      <span className={kw}>false</span>)
    </div>
    <div className="pl-6">
      author &nbsp;&nbsp;&nbsp;<span className={fn}>User</span>{" "}
      &nbsp;&nbsp;&nbsp;@relation(fields: [authorId], references: [id])
    </div>
    <div className="pl-6">
      authorId &nbsp;<span className={kw}>String</span>
    </div>
    <div>{"}"}</div>
  </>
);

const dartCode = (
  <>
    <div>
      <span className={kw}>class</span> <span className={fn}>User</span> {"{"}
    </div>
    <div className="pl-6">
      <span className={kw}>final</span> <span className={kw}>String</span> id;
    </div>
    <div className="pl-6">
      <span className={kw}>final</span> <span className={kw}>String</span>{" "}
      email;
    </div>
    <div className="pl-6">
      <span className={kw}>final</span> <span className={kw}>String</span>?
      name;
    </div>
    <div className="pl-6">
      <span className={kw}>final</span> <span className={fn}>DateTime</span>{" "}
      createdAt;
    </div>
    <div className="mt-2 pl-6">
      <span className={fn}>User</span>({"{"}
      <span className={kw}>required</span> <span className={kw}>this</span>.id,{" "}
      <span className={kw}>required</span> <span className={kw}>this</span>
      .email, <span className={kw}>this</span>
      .name, <span className={kw}>required</span>{" "}
      <span className={kw}>this</span>.createdAt{"}"});
    </div>
    <div>{"}"}</div>
  </>
);

const codeTabs: CodeTab[] = [
  { label: "schema.prisma", content: prismaCode },
  { label: "model.dart", content: dartCode },
];

const CodePreview = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<"editor" | "docs">("editor");

  return (
    <section className="flex-[1.5] flex flex-col gap-6">
      {/* Header with toggle */}
      <div className="flex justify-between items-end">
        <header>
          <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mb-2">
            Generated Code
          </h2>
          <h1 className="text-3xl font-black font-[Manrope] text-slate-900 leading-none">
            Output Preview
          </h1>
        </header>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("editor")}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              viewMode === "editor"
                ? "bg-white shadow-sm text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setViewMode("docs")}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              viewMode === "docs"
                ? "bg-white shadow-sm text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Docs
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5">
        {/* macOS-style title bar */}
        <div className="h-12 bg-[#2d2d2d] flex items-center px-4 justify-between shrink-0">
          {/* Traffic lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* File tabs */}
          <div className="flex gap-px">
            {codeTabs.map((tab, index) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-3 text-[11px] font-medium transition-colors cursor-pointer ${
                  index === activeTab
                    ? "bg-[#1e1e1e] text-white border-t-2 border-blue-500"
                    : "bg-[#2d2d2d] text-slate-500 hover:bg-[#3d3d3d]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              <Copy className="w-4 h-4" />
            </button>
            <button className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code content */}
        <div className="flex-1 p-6 font-mono text-[13px] leading-relaxed overflow-y-auto text-white/90">
          {codeTabs[activeTab].content}
        </div>
      </div>

      {/* Download Button */}
      <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg">
        <Download className="w-4 h-4" />
        Download All (.zip)
      </button>
    </section>
  );
};

export default CodePreview;
