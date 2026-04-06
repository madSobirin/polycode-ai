import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const record = await prisma.history.findUnique({
      where: { id },
      select: { zipBuffer: true, sourceType: true, createdAt: true },
    });

    if (!record || !record.zipBuffer) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    const timestamp = record.createdAt.toISOString().split("T")[0];
    const filename = `polycode-${record.sourceType.toLowerCase()}-${timestamp}.zip`;

    return new Response(record.zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": record.zipBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Download failed" },
      { status: 500 }
    );
  }
}
