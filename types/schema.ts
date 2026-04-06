// ─── Parsed Schema Types ───────────────────────────────────────────────────

export interface ParsedColumn {
  name: string;
  type: string;        // Raw SQL/JSON type (e.g. "VARCHAR", "INT", "TEXT")
  nullable: boolean;
  isPrimary: boolean;
  isUnique: boolean;
  defaultValue?: string;
}

export interface ParsedRelation {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: "one-to-one" | "one-to-many" | "many-to-many";
}

export interface ParsedTable {
  name: string;
  columns: ParsedColumn[];
  relations: ParsedRelation[];
}

export interface ParsedSchema {
  tables: ParsedTable[];
  rawSql?: string;
}

// ─── Generation Types ──────────────────────────────────────────────────────

export type GenerationTarget = "prisma" | "flutter" | "typescript";

export interface GeneratedFile {
  filename: string;
  content: string;
  target: GenerationTarget;
}

export interface GenerationResult {
  generationId: string;
  downloadUrl: string;
  files: GeneratedFile[];
  summary: GenerationSummary;
}

export interface GenerationSummary {
  tablesFound: number;
  relationsFound: number;
  filesGenerated: number;
  targets: GenerationTarget[];
}

// ─── API Types ──────────────────────────────────────────────────────────────

export interface GenerateRequest {
  file: File;
  targets: GenerationTarget[];
  userId?: string;
}

export interface HistoryRecord {
  id: string;
  sourceType: string;
  targetTypes: string[];
  generatedCode: Record<string, string>;
  createdAt: string;
}
