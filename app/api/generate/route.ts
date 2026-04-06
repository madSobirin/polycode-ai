import { NextResponse } from "next/server";
import { parseSchema } from "@/lib/ai/parseSchema";
import { generatePrisma, generateDart, generateTypeScript } from "@/lib/generators";
import { buildZip } from "@/lib/buildZip";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { GeneratedFile, GenerationTarget } from "@/types/schema";

export const maxDuration = 60; // Vercel max for hobby

export async function POST(request: Request) {
  try {
    // ── 1. Parse FormData ──────────────────────────────────────────────────
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetsRaw = formData.get("targets") as string | null;
    const userIdOverride = formData.get("userId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const allowedTypes = [".sql", ".json"];
    const fileName = file.name.toLowerCase();
    const fileExt = allowedTypes.find((ext) => fileName.endsWith(ext));

    if (!fileExt) {
      return NextResponse.json(
        { error: "Only .sql and .json files are supported" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const targets: GenerationTarget[] = targetsRaw
      ? (targetsRaw.split(",").map((t) => t.trim()) as GenerationTarget[])
      : ["prisma"];

    // ── 2. Get user session ────────────────────────────────────────────────
    const session = await getServerSession(authOptions);
    const userId = userIdOverride ?? session?.user?.id ?? null;

    // ── 3. Read file content ───────────────────────────────────────────────
    const fileContent = await file.text();
    const fileType = fileExt === ".sql" ? "sql" : "json";

    // ── 4. AI Parsing ──────────────────────────────────────────────────────
    const parsedSchema = await parseSchema(fileContent, fileType);

    if (parsedSchema.tables.length === 0) {
      return NextResponse.json(
        { error: "Could not parse any tables from the file" },
        { status: 422 }
      );
    }

    // ── 5. Generate Code ───────────────────────────────────────────────────
    const generatedFiles: GeneratedFile[] = [];

    if (targets.includes("prisma")) {
      generatedFiles.push(generatePrisma(parsedSchema.tables));
    }

    if (targets.includes("flutter")) {
      generatedFiles.push(...generateDart(parsedSchema.tables));
    }

    if (targets.includes("typescript")) {
      generatedFiles.push(generateTypeScript(parsedSchema.tables));
    }

    // ── 6. Build ZIP ───────────────────────────────────────────────────────
    const zipBuffer = await buildZip(generatedFiles);

    // ── 7. Build generatedCode JSON map ────────────────────────────────────
    const generatedCodeMap: Record<string, string> = {};
    for (const f of generatedFiles) {
      generatedCodeMap[f.filename] = f.content;
    }

    // ── 8. Save to DB ──────────────────────────────────────────────────────
    const totalRelations = parsedSchema.tables.reduce(
      (acc, t) => acc + t.relations.length,
      0
    );

    const historyRecord = await prisma.history.create({
      data: {
        sourceType: fileType.toUpperCase(),
        targetTypes: targets,
        generatedCode: generatedCodeMap,
        zipBuffer: zipBuffer,
        ...(userId ? { userId } : {}),
      } as Parameters<typeof prisma.history.create>[0]["data"],
    });

    // ── 9. Return response ─────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      generationId: historyRecord.id,
      downloadUrl: `/api/download/${historyRecord.id}`,
      files: generatedFiles.map((f) => ({
        filename: f.filename,
        target: f.target,
        content: f.content,
      })),
      summary: {
        tablesFound: parsedSchema.tables.length,
        relationsFound: totalRelations,
        filesGenerated: generatedFiles.length,
        targets,
        usedFallback: parsedSchema.usedFallback ?? false,
      },
    });
  } catch (error) {
    console.error("Generate error:", error);

    // Handle Gemini/Google API rate limit
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED")) {
      return NextResponse.json(
        {
          error:
            "AI API rate limit reached. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
