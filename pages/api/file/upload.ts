import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1️⃣ Parse multipart form
    const form = new IncomingForm({
      keepExtensions: true,
      multiples: false,
      maxFileSize: 1024 * 1024 * 1024, // 1024MB (1gb)
    });

    const { fields, files } = await new Promise<{
      fields: Record<string, any>;
      files: Record<string, any>;
    }>((resolve, reject) => {
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const uploadedFile = Array.isArray(files.file)
      ? files.file?.[0]
      : files.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: "File is required" });
    }

    // 2️⃣ Extract incoming data
    const basePath = fields.basePath?.[0];
    const folderName = fields.folderName?.[0];
    const subFolderName = fields.subFolderName?.[0];
    const userId = fields.userId?.[0];

    if (!basePath || !folderName) {
      return res.status(400).json({
        error: "basePath and folderName are required",
      });
    }

    const fileId = `${Date.now()}-${userId}-${uploadedFile.originalFilename}`;

    // 3️⃣ Build final path
    const uploadDir = path.join(basePath, folderName, subFolderName ?? "");
    ensureDir(uploadDir);

    const finalPath = path.join(uploadDir, fileId);

    // 4️⃣ Move file to destination
    await fs.promises.copyFile(uploadedFile.filepath, finalPath);
    await fs.promises.unlink(uploadedFile.filepath);

    // 5️⃣ Prepare response data
    const responseData = {
      filePath: finalPath,
      fileId,
      fileName: uploadedFile.originalFilename,
      fileSize: uploadedFile.size,
      fileType: uploadedFile.mimetype || "application/octet-stream",
    };

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: "File upload failed",
    });
  }
}
