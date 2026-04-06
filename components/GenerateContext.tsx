"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  GenerationTarget,
  GenerationResult,
  GeneratedFile,
} from "@/types/schema";

// ─── State Shape ──────────────────────────────────────────────────────────────
interface GenerateState {
  // Input state
  uploadedFile: File | null;
  selectedTargets: GenerationTarget[];

  // Process state
  isLoading: boolean;
  error: string | null;

  // Result state
  result: GenerationResult | null;
  activeTab: string | null;

  // Actions
  setUploadedFile: (file: File | null) => void;
  toggleTarget: (target: GenerationTarget) => void;
  generate: () => Promise<void>;
  reset: () => void;
  setActiveTab: (tab: string) => void;
  copyToClipboard: (content: string) => Promise<void>;
  download: () => void;
}

const GenerateContext = createContext<GenerateState | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function GenerateProvider({ children }: { children: ReactNode }) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<GenerationTarget[]>([
    "prisma",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const toggleTarget = useCallback((target: GenerationTarget) => {
    setSelectedTargets((prev) =>
      prev.includes(target)
        ? prev.filter((t) => t !== target)
        : [...prev, target]
    );
  }, []);

  const generate = useCallback(async () => {
    if (!uploadedFile) {
      setError("Please upload a file first");
      return;
    }
    if (selectedTargets.length === 0) {
      setError("Please select at least one output target");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("targets", selectedTargets.join(","));

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        return;
      }

      setResult(data as GenerationResult);

      // Auto-select first tab
      if (data.files?.length > 0) {
        setActiveTab((data.files as GeneratedFile[])[0].filename);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, selectedTargets]);

  const reset = useCallback(() => {
    setUploadedFile(null);
    setSelectedTargets(["prisma"]);
    setError(null);
    setResult(null);
    setActiveTab(null);
  }, []);

  const copyToClipboard = useCallback(async (content: string) => {
    await navigator.clipboard.writeText(content);
  }, []);

  const download = useCallback(() => {
    if (!result?.downloadUrl) return;
    window.location.href = result.downloadUrl;
  }, [result]);

  return (
    <GenerateContext.Provider
      value={{
        uploadedFile,
        selectedTargets,
        isLoading,
        error,
        result,
        activeTab,
        setUploadedFile,
        toggleTarget,
        generate,
        reset,
        setActiveTab,
        copyToClipboard,
        download,
      }}
    >
      {children}
    </GenerateContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useGenerate() {
  const ctx = useContext(GenerateContext);
  if (!ctx) {
    throw new Error("useGenerate must be used within <GenerateProvider>");
  }
  return ctx;
}
