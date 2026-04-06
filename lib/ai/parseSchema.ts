import { GoogleGenAI } from "@google/genai";
import type { ParsedSchema, ParsedTable, ParsedColumn } from "@/types/schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert database schema parser.
Analyze SQL CREATE TABLE statements or JSON schema definitions and extract structured information.

Respond with ONLY valid JSON in this exact format:
{
  "tables": [
    {
      "name": "table_name",
      "columns": [
        {
          "name": "column_name",
          "type": "SQL_TYPE",
          "nullable": true,
          "isPrimary": false,
          "isUnique": false,
          "defaultValue": "optional_default"
        }
      ],
      "relations": [
        {
          "fromTable": "this_table",
          "fromColumn": "foreign_key_column",
          "toTable": "referenced_table",
          "toColumn": "referenced_column",
          "type": "one-to-many"
        }
      ]
    }
  ]
}

Rules:
- Detect foreign keys and infer relations automatically
- Keep column types as standard SQL types (VARCHAR, INT, TEXT, etc.)
- Respond ONLY with valid JSON, no markdown fences`;

// ─── Gemini AI Parser ────────────────────────────────────────────────────────
async function parseWithAI(
  fileContent: string,
  fileType: "sql" | "json"
): Promise<ParsedSchema> {
  const userMessage =
    fileType === "sql"
      ? `Parse this SQL schema:\n\n${fileContent}`
      : `Parse this JSON schema definition:\n\n${fileContent}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.1,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  const rawText = response.text ?? "";
  const jsonMatch =
    rawText.match(/```(?:json)?\s*([\s\S]*?)```/) ||
    rawText.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1] : rawText;

  const parsed: { tables: ParsedTable[] } = JSON.parse(jsonStr.trim());
  return {
    tables: parsed.tables ?? [],
    rawSql: fileType === "sql" ? fileContent : undefined,
  };
}

// ─── Built-in SQL Fallback Parser ───────────────────────────────────────────
function parseWithFallback(
  fileContent: string,
  fileType: "sql" | "json"
): ParsedSchema {
  if (fileType === "json") {
    return parseJsonFallback(fileContent);
  }
  return parseSqlFallback(fileContent);
}

function parseSqlFallback(sql: string): ParsedSchema {
  const tables: ParsedTable[] = [];

  // Match CREATE TABLE blocks
  const createTableRegex =
    /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"']?(\w+)[`"']?\s*\(([\s\S]*?)\);/gi;

  let tableMatch: RegExpExecArray | null;
  while ((tableMatch = createTableRegex.exec(sql)) !== null) {
    const tableName = tableMatch[1];
    const columnBlock = tableMatch[2];
    const columns: ParsedColumn[] = [];
    const relations: ParsedTable["relations"] = [];

    // Split by comma but NOT inside parentheses
    const lines = splitColumnDefs(columnBlock);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Skip constraints that aren't inline
      if (/^(KEY|INDEX|UNIQUE KEY|FULLTEXT|SPATIAL)/i.test(trimmed)) continue;

      // PRIMARY KEY constraint
      if (/^PRIMARY\s+KEY/i.test(trimmed)) {
        const pkMatch = trimmed.match(/PRIMARY\s+KEY\s*\(([^)]+)\)/i);
        if (pkMatch) {
          const pkCols = pkMatch[1].split(",").map((c) => c.trim().replace(/[`"']/g, ""));
          columns.forEach((col) => {
            if (pkCols.includes(col.name)) col.isPrimary = true;
          });
        }
        continue;
      }

      // FOREIGN KEY constraint
      if (/^(?:CONSTRAINT\s+\w+\s+)?FOREIGN\s+KEY/i.test(trimmed)) {
        const fkMatch = trimmed.match(
          /FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+[`"']?(\w+)[`"']?\s*\(([^)]+)\)/i
        );
        if (fkMatch) {
          relations.push({
            fromTable: tableName,
            fromColumn: fkMatch[1].trim().replace(/[`"']/g, ""),
            toTable: fkMatch[2].trim(),
            toColumn: fkMatch[3].trim().replace(/[`"']/g, ""),
            type: "one-to-many",
          });
        }
        continue;
      }

      // UNIQUE constraint
      if (/^UNIQUE/i.test(trimmed)) continue;

      // Column definition: name type [constraints...]
      const colMatch = trimmed.match(/^[`"']?(\w+)[`"']?\s+(\w+(?:\([^)]*\))?)(.*)/i);
      if (!colMatch) continue;

      const colName = colMatch[1];
      const colType = colMatch[2].replace(/\([^)]*\)/, "").toUpperCase();
      const rest = colMatch[3].toUpperCase();

      columns.push({
        name: colName,
        type: colType,
        nullable: !rest.includes("NOT NULL"),
        isPrimary: rest.includes("PRIMARY KEY"),
        isUnique: rest.includes("UNIQUE"),
        defaultValue: extractDefault(colMatch[3]),
      });
    }

    if (columns.length > 0) {
      tables.push({ name: tableName, columns, relations });
    }
  }

  return { tables, rawSql: sql };
}

function parseJsonFallback(jsonStr: string): ParsedSchema {
  try {
    const data = JSON.parse(jsonStr);
    // If it's already a schema format
    if (Array.isArray(data.tables)) return { tables: data.tables };

    // Try to infer tables from top-level keys
    const tables: ParsedTable[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        const columns: ParsedColumn[] = Object.entries(
          value as Record<string, unknown>
        ).map(([field, val]) => ({
          name: field,
          type: inferJsonType(val),
          nullable: val === null,
          isPrimary: field === "id",
          isUnique: field === "email",
          defaultValue: undefined,
        }));
        tables.push({ name: key, columns, relations: [] });
      }
    }
    return { tables };
  } catch {
    return { tables: [] };
  }
}

function inferJsonType(val: unknown): string {
  if (val === null) return "TEXT";
  switch (typeof val) {
    case "number": return Number.isInteger(val) ? "INT" : "FLOAT";
    case "boolean": return "BOOLEAN";
    case "string": {
      const s = val as string;
      if (/^\d{4}-\d{2}-\d{2}/.test(s)) return "DATETIME";
      if (s.length > 100) return "TEXT";
      return "VARCHAR";
    }
    default: return "TEXT";
  }
}

function splitColumnDefs(block: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of block) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      result.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) result.push(current);
  return result;
}

function extractDefault(rest: string): string | undefined {
  const match = rest.match(/DEFAULT\s+([^\s,]+)/i);
  return match ? match[1].replace(/['"]/g, "") : undefined;
}

// ─── Main export: AI with fallback ───────────────────────────────────────────
export async function parseSchema(
  fileContent: string,
  fileType: "sql" | "json"
): Promise<ParsedSchema & { usedFallback?: boolean }> {
  // Skip AI if no key configured
  const hasApiKey =
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10;

  if (hasApiKey) {
    try {
      const result = await parseWithAI(fileContent, fileType);
      if (result.tables.length > 0) return result;
      // AI returned empty — fall through to fallback
    } catch (err) {
      const msg = String(err);
      const isRateLimit =
        msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
      const isNotFound = msg.includes("404") || msg.includes("NOT_FOUND");

      if (!isRateLimit && !isNotFound) throw err; // Unexpected error — rethrow
      console.warn(`AI parse failed (${isRateLimit ? "rate limit" : "not found"}), using fallback parser`);
    }
  }

  // Fallback: built-in parser
  const result = parseWithFallback(fileContent, fileType);
  return { ...result, usedFallback: true };
}
