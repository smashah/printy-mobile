export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export const uploadToR2 = async (
  r2: R2Bucket,
  file: File,
  options: {
    path?: string;
    maxSize?: number;
    allowedTypes?: string[];
    customMetadata?: Record<string, string>;
  } = {}
): Promise<UploadResult> => {
  const { path = "uploads", maxSize = 10 * 1024 * 1024, allowedTypes, customMetadata } = options;

  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize} bytes`);
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }

  const ext = file.name.split(".").pop();
  const key = `${path}/${crypto.randomUUID()}.${ext}`;

  await r2.put(key, file, {
    httpMetadata: {
      contentType: file.type,
    },
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      ...customMetadata,
    },
  });

  return {
    key,
    url: key,
    size: file.size,
    contentType: file.type,
  };
};

export const deleteFromR2 = async (r2: R2Bucket, key: string): Promise<void> => {
  await r2.delete(key);
};

export const getFromR2 = async (r2: R2Bucket, key: string): Promise<R2ObjectBody | null> => {
  return r2.get(key);
};

export const uploadImage = async (
  r2: R2Bucket,
  file: File,
  options?: { customMetadata?: Record<string, string> }
) => {
  return uploadToR2(r2, file, {
    path: "images",
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    ...options,
  });
};

export const uploadDocument = async (
  r2: R2Bucket,
  file: File,
  options?: { customMetadata?: Record<string, string> }
) => {
  return uploadToR2(r2, file, {
    path: "documents",
    maxSize: 20 * 1024 * 1024,
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    ...options,
  });
};

export const generateStorageKey = (path: string, fileExtension: string): string => {
  const id = crypto.randomUUID();
  return `${path}/${id}.${fileExtension}`;
};

