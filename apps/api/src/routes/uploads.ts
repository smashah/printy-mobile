import { Hono } from "hono";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import type { APIBindings } from "../middleware/type";
import { zodValidator } from "../middleware/validator";
import {
  uploadToR2,
  uploadImage,
  deleteFromR2,
  generateStorageKey,
} from "@printy-mobile/common";

export const uploadsRouter = new Hono<APIBindings>()
  // Direct file upload
  .post(
    "/direct",
    zodValidator("query", z.object({ path: z.string().optional().default("uploads") })),
    async (c) => {
      const { path } = c.req.valid("query");
      const formData = await c.req.parseBody();
      const file = formData["file"] as File;

      if (!file) {
        throw new HTTPException(400, { message: "No file provided" });
      }

      const bucket = c.env.MEDIA_BUCKET;
      const userId = c.var.user?.id;

      const result = await uploadToR2(bucket, file, {
        path,
        maxSize: 10 * 1024 * 1024,
        customMetadata: {
          uploadedBy: userId || "anonymous",
        },
      });

      return c.json({ success: true, data: result });
    }
  )

  // Direct image upload
  .post("/image", async (c) => {
    const formData = await c.req.parseBody();
    const file = formData["file"] as File;

    if (!file) {
      throw new HTTPException(400, { message: "No file provided" });
    }

    const bucket = c.env.MEDIA_BUCKET;
    const userId = c.var.user?.id;

    const result = await uploadImage(bucket, file, {
      customMetadata: {
        uploadedBy: userId || "anonymous",
      },
    });

    return c.json({ success: true, data: result });
  })

  // Get presigned URL
  .post(
    "/presigned",
    zodValidator(
      "json",
      z.object({
        fileExtension: z.string(),
        path: z.string().optional().default("uploads"),
        expiresIn: z.number().optional().default(3600),
      })
    ),
    async (c) => {
      const { fileExtension, path, expiresIn } = c.req.valid("json");
      const p3 = c.var.p3;

      const key = generateStorageKey(path, fileExtension);

      const uploadUrl = await p3.getPresignedUploadUrl({
        filename: key,
        expiresIn,
      });

      // @ts-expect-error - pico-s3 types issue
      const downloadUrl = await p3.getPresignedUrl({
        filename: key,
      });

      return c.json({
        success: true,
        data: {
          uploadUrl,
          downloadUrl: downloadUrl.split("?")[0],
          key,
        },
      });
    }
  )

  // Delete file
  .delete("/:key", async (c) => {
    const key = c.req.param("key");
    const bucket = c.env.MEDIA_BUCKET;
    const userId = c.var.user?.id;

    const object = await bucket.head(key);
    if (!object) {
      throw new HTTPException(404, { message: "File not found" });
    }

    const uploadedBy = object.customMetadata?.uploadedBy;
    if (uploadedBy !== userId) {
      throw new HTTPException(403, { message: "Forbidden" });
    }

    await deleteFromR2(bucket, key);

    return c.json({ success: true, message: "File deleted" });
  })

  // Start presigned upload flow
  .post(
    "/flow/start",
    zodValidator(
      "json",
      z.object({
        fileExtension: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
      })
    ),
    async (c) => {
      const { fileExtension } = c.req.valid("json");
      const p3 = c.var.p3;

      const key = generateStorageKey("uploads", fileExtension);

      const uploadUrl = await p3.getPresignedUploadUrl({
        filename: key,
        expiresIn: 3600,
      });

      // @ts-expect-error - pico-s3 types issue
      const downloadUrl = await p3.getPresignedUrl({
        filename: key,
      });

      return c.json({
        success: true,
        data: {
          uploadUrl,
          downloadUrl: downloadUrl.split("?")[0],
          key,
        },
      });
    }
  )

  // Complete presigned upload
  .put(
    "/flow/complete",
    zodValidator("json", z.object({ key: z.string() })),
    async (c) => {
      c.req.valid("json");

      // Update status in database if needed
      // await db.update(schema.uploads)
      //   .set({ status: "completed" })
      //   .where(eq(schema.uploads.key, key));

      return c.json({ success: true, message: "Upload completed" });
    }
  );

