import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { auth } from "@/modules/server/auth/betterauth/auth";
import { prismaFilenest } from "@/modules/server/prisma/prisma";
import path from "path";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("fileName");
  const filePath = searchParams.get("filePath");
  const fileType = searchParams.get("fileType");
  const id = searchParams.get("id");

  if (!fileName || !filePath || !fileType || !id) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const userId = session.user.id;
  const orgId = session.session.activeOrganizationId;

  const userFile = await prismaFilenest.userFile.findUnique({
    where: {
      id: BigInt(id),
      userId,
      orgId,
      fileName,
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

  if (
    !userFile ||
    userFile.storageType !== "LOCAL" ||
    userFile.appStorageSetting?.type !== "LOCAL"
  ) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const BASE_UPLOAD_DIR =
    userFile.appStorageSetting.localStorageConfig?.basePath || "";

  const resolvedPath = path.resolve(BASE_UPLOAD_DIR, filePath);

  if (!resolvedPath.startsWith(BASE_UPLOAD_DIR)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!fs.existsSync(resolvedPath)) {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const range = req.headers.get("range");

  if (range) {
    const [startStr, endStr] = range.replace("bytes=", "").split("-");
    const start = Number(startStr);
    const end = endStr ? Number(endStr) : stat.size - 1;

    const stream = fs.createReadStream(filePath, { start, end });

    return new NextResponse(stream as any, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(end - start + 1),
        "Content-Type": fileType,
      },
    });
  }

  return new NextResponse(fs.createReadStream(filePath) as any, {
    headers: {
      "Content-Length": String(stat.size),
      "Content-Type": fileType,
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
