import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { auth } from "@/modules/server/auth/betterauth/auth";
import { prismaFilenest } from "@/modules/server/prisma/prisma";
import path from "path";

export const runtime = "nodejs"; // ✅ required for fs

export async function DELETE(req: NextRequest) {
  let body: { fileName?: string; id?: bigint };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { fileName, id } = body;

  const session = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!id || !fileName || typeof id !== "bigint") {
    return NextResponse.json(
      { error: "Missing or invalid fileId" },
      { status: 400 },
    );
  }

  try {
    const fileRecord = await prismaFilenest.userFile.findUnique({
      where: {
        id,
        fileName,
        orgId: session.session.activeOrganizationId,
        userId: session.user.id,
      },
      include: {
        appStorageSetting: {
          select: {
            type: true,
            localStorageConfig: true,
          },
        },
      },
    });

    if (!fileRecord || fileRecord.storageType !== "LOCAL") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const BASE_UPLOAD_DIR =
      fileRecord.appStorageSetting?.localStorageConfig?.basePath || "";

    const resolvedPath = path.resolve(BASE_UPLOAD_DIR, fileRecord.filePath);

    if (!resolvedPath.startsWith(BASE_UPLOAD_DIR)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!fs.existsSync(fileRecord.filePath)) {
      return NextResponse.json(
        { error: "File does not exist on server" },
        { status: 404 },
      );
    }

    // Delete file from filesystem
    await fs.promises.unlink(fileRecord.filePath);

    // Delete DB record
    await prismaFilenest.userFile.delete({
      where: {
        id,
        fileName,
        orgId: session.session.activeOrganizationId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("File delete error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
