"use client";

/**
 * FileUpload Component
 *
 * A versatile file upload component that supports three modes:
 *
 * 1. Upload Mode (default): Automatically uploads files to a server endpoint with progress tracking
 * 2. S3 Direct Upload Mode: Gets presigned URLs and uploads directly to S3
 * 3. Form Input Mode: Simple file input for use in forms without automatic uploads
 *
 * Features:
 * - Drag and drop support
 * - File type and size validation with toast notifications
 * - Preview modes: grid, list, or compact
 * - Single and multiple file uploads
 * - Progress tracking (upload mode)
 * - Upload cancellation with AbortController (click X during upload to cancel)
 * - Automatic validation error notifications
 *
 * @example Upload Mode
 * ```tsx
 * <FileUpload
 *   apiEndpoint="/api/upload"
 *   multiple={true}
 *   maxFiles={5}
 *   onSuccess={(files) => console.log('Uploaded:', files)}
 *   onError={(error) => console.error('Error:', error)}
 * />
 * ```
 *
 * @example S3 Direct Upload Mode
 * ```tsx
 * <FileUpload
 *   useS3={true}
 *   s3PresignedUrlEndpoint="/assets/media/s3"
 *   multiple={true}
 *   maxFiles={5}
 *   onSuccess={(files) => console.log('Uploaded to S3:', files)}
 *   onError={(error) => console.error('Error:', error)}
 * />
 * ```
 *
 * @example Form Input Mode - Uncontrolled
 * ```tsx
 * const [files, setFiles] = useState<File[]>([]);
 *
 * <FileUpload
 *   asFormInput
 *   name="documents"
 *   multiple={true}
 *   maxFiles={3}
 *   fileTypes={['image/*', '.pdf']}
 *   onChange={(files) => setFiles(files)}
 * />
 * ```
 *
 * @example Form Input Mode - Controlled
 * ```tsx
 * const [files, setFiles] = useState<File[]>([]);
 *
 * <FileUpload
 *   asFormInput
 *   name="documents"
 *   value={files}
 *   onChange={(files) => setFiles(files)}
 *   multiple={true}
 * />
 * ```
 *
 * @example Compact Mode - Single File (Profile Picture, Logo)
 * ```tsx
 * const [logo, setLogo] = useState<File[]>([]);
 *
 * <FileUpload
 *   asFormInput
 *   name="logo"
 *   value={logo}
 *   onChange={setLogo}
 *   multiple={false}
 *   compact={true}
 *   fileTypes={['image/*']}
 * />
 * // Shows: [thumbnail] [filename.jpg] [X]
 * // Toast notifications shown for invalid files
 * ```
 */

import * as React from "react";
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "./button";
import { Progress } from "./progress";
import { cn } from "../lib/utils";

/**
 * Visual display mode for selected files.
 * - "file": single column, large file tiles without grid
 * - "preview": image/video thumbnails in a responsive grid
 * - "list": compact row layout with icon and metadata
 */
export type FileUploadPreviewMode = "file" | "preview" | "list";

/**
 * Normalized representation of an uploaded file returned by the API/S3 flow.
 */
export type UploadedFile = {
  /** Stable identifier from the backend (or a generated id for S3 direct mode). */
  id: string;
  /** Stored filename (may differ from original). */
  filename: string;
  /** Original filename provided by the client prior to upload. */
  originalFilename: string;
  /** Lowercase file extension without dot, e.g. "png". */
  fileExtension: string;
  /** MIME type of the file, e.g. "image/png". */
  mimeType: string;
  /** File size in bytes. */
  fileSize: number;
  /** Optional image width in pixels (when available). */
  width?: number;
  /** Optional image height in pixels (when available). */
  height?: number;
  /** Provider-specific storage key or object key. */
  storageKey: string;
  /** Public or signed URL to download the file. */
  downloadUrl: string;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** Arbitrary metadata returned by the server. */
  metadata?: Record<string, any>;
};

/**
 * Props for the FileUpload component.
 *
 * Modes:
 * - Upload mode (default): posts files to `apiEndpoint` with progress and deletion support.
 * - S3 direct mode: set `useS3` and provide `s3PresignedUrlEndpoint` to PUT directly to S3.
 * - Form input mode: set `asFormInput` to manage files without uploading (validation + preview only).
 */
export interface FileUploadProps {
  /** Optional explicit storage key. */
  storageKey?: string;
  /** Optional API host prefix for S3 presign endpoint. */
  apiHost?: string;
  /** Upload/delete endpoint for default upload mode. */
  apiEndpoint?: string;
  /** Allow selecting multiple files. Default: true. */
  multiple?: boolean;
  /** Maximum number of files permitted. Default: 10. */
  maxFiles?: number;
  /** Toggle generic media handling when supported by backend. */
  isGenericMedia?: boolean;
  /** Max file size in bytes. Default: 10MB. */
  sizeLimit?: number; // in bytes, default 10MB
  /** Allowed MIME types or extensions (e.g., ['image/*', '.pdf']). */
  fileTypes?: string[]; // MIME types or extensions like ['image/*', '.pdf']
  preview?: FileUploadPreviewMode;
  drag?: boolean;
  className?: string;
  disabled?: boolean;
  /** Called when one or more files finish uploading successfully. */
  onSuccess?: (files: UploadedFile[]) => void;
  /** Called on validation or network errors. */
  onError?: (error: Error) => void;
  /** Called after a successfully deleted uploaded file. */
  onDelete?: (fileId: string) => void;
  headers?: Record<string, string>;
  /** When true, requests public S3 uploads/URLs if backend supports it. Default: false. */
  isPublic?: boolean; // Default: false
  // Form input mode props
  /** Enables controlled/uncontrolled form-input behavior without network uploads. */
  asFormInput?: boolean;
  name?: string;
  /** Controlled value of selected File(s) in form-input mode. */
  value?: File[];
  /** onChange callback for form-input mode. */
  onChange?: (files: File[]) => void;

  // Compact mode - shows preview, filename, and delete button in a row
  compact?: boolean;

  // S3 direct upload mode
  /** Enable direct-to-S3 upload flow using a presign endpoint. */
  useS3?: boolean;
  /** Presign endpoint used in S3 mode. Default: /assets/media/s3 */
  s3PresignedUrlEndpoint?: string; // Default: /assets/media/s3
}

/**
 * Validates props for upload modes.
 * Skips validation when `asFormInput` is enabled.
 *
 * Note: No required properties in template mode.
 */
export function validateFileUploadProps(props: FileUploadProps): void {
  // Skip validation if using as form input
  if (props.asFormInput) {
    return;
  }
}

interface FileWithProgress {
  file: File;
  id: string;
  progress: number;
  uploading: boolean;
  error?: string;
  uploaded?: UploadedFile;
  abortController?: AbortController;
}

/**
 * A versatile file upload component with drag & drop, validation, progress,
 * abort, deletion, and multiple display modes. Supports three modes:
 *
 * - Upload mode (default): POSTs files to `apiEndpoint` and surfaces progress.
 * - S3 direct mode: requests a presigned URL then PUTs the file directly to S3.
 * - Form input mode: no network requests; acts like a validated file input.
 *
 * See the header examples for usage across modes.
 */
export function FileUpload({
  apiHost,
  apiEndpoint,
  isGenericMedia = false,
  multiple = true,
  maxFiles = 10,
  sizeLimit = 10 * 1024 * 1024, // 10MB default
  fileTypes = ["image/*", "video/*", "audio/*", ".pdf"],
  preview = "preview",
  drag = true,
  className,
  disabled = false,
  onSuccess,
  onError,
  onDelete,
  headers = {},
  asFormInput = false,
  name,
  value,
  onChange,
  compact = false,
  useS3 = false,
  s3PresignedUrlEndpoint = "/assets/media/s3",
  isPublic = false,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<FileWithProgress[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const objectUrlsRef = React.useRef<Map<string, string>>(new Map());

  // Use controlled value when in form input mode
  const isControlled = asFormInput && value !== undefined;

  // Sync controlled value with internal state for preview
  React.useEffect(() => {
    if (isControlled && value) {
      const newFiles: FileWithProgress[] = value.map((file) => ({
        file,
        id: crypto.randomUUID(),
        progress: 100,
        uploading: false,
      }));
      setFiles(newFiles);
    } else if (isControlled && !value) {
      setFiles([]);
    }
  }, [isControlled, value]);

  // Cleanup object URLs when component unmounts or files change
  React.useEffect(() => {
    const currentUrls = objectUrlsRef.current;

    return () => {
      // Revoke all object URLs on cleanup
      for (const url of currentUrls.values()) {
        URL.revokeObjectURL(url);
      }
      currentUrls.clear();
    };
  }, [files]);

  /**
   * Converts a byte size to a human-readable string.
   * @param bytes Number of bytes
   * @returns Readable size like "2.3 MB"
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
  };

  /**
   * Returns an icon element appropriate for a MIME type.
   */
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-8 w-8" />;
    if (mimeType.startsWith("video/")) return <FileVideo className="h-8 w-8" />;
    if (mimeType.startsWith("audio/")) return <FileAudio className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  /**
   * Validates a file against `sizeLimit` and `fileTypes`.
   * @returns `null` when valid; otherwise a human-readable error message.
   */
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > sizeLimit) {
      return `File size exceeds limit of ${formatFileSize(sizeLimit)}`;
    }

    // Check file type
    const fileType = file.type;
    const fileName = file.name;
    const fileExtension = `.${fileName.split(".").pop()?.toLowerCase() || ""}`;

    const isValidType = fileTypes.some((type) => {
      if (type.includes("*")) {
        const baseType = type.split("/")[0];
        return fileType.startsWith(`${baseType}/`);
      }
      if (type.startsWith(".")) {
        return fileExtension === type.toLowerCase();
      }
      return fileType === type;
    });

    if (!isValidType) {
      return `File type not supported. Allowed types: ${fileTypes.join(", ")}`;
    }

    return null;
  };

  /**
   * Direct-to-S3 upload flow using a presigned URL.
   * Requests a signed URL from `s3PresignedUrlEndpoint` then PUTs the file.
   * Tracks progress and supports cancellation via AbortController.
   */
  const uploadFileToS3 = async (fileWithProgress: FileWithProgress) => {
    const { file } = fileWithProgress;

    // Create AbortController for this upload
    const abortController = new AbortController();

    // Store AbortController with the file
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileWithProgress.id ? { ...f, abortController } : f
      )
    );

    try {
      // Step 1: Get presigned URL from backend
      const fileExtension = file.name.split(".").pop() || "";

      const presignedResponse = await fetch(
        `${apiHost || ""}${s3PresignedUrlEndpoint}?type=generic&isPublic=${isPublic}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "x-file-extension": fileExtension,
            ...headers,
          },
        }
      );

      if (!presignedResponse.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { data } = await presignedResponse.json();
      const { url: presignedUrl, storageKey, downloadUrl } = data;

      // Step 2: Upload directly to S3 using presigned URL
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileWithProgress.id ? { ...f, progress } : f
            )
          );
        }
      });

      // Handle completion
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`S3 upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during S3 upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });

        // Listen to abort signal
        abortController.signal.addEventListener("abort", () => {
          xhr.abort();
        });
      });

      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.send(file);

      await uploadPromise;

      // Create uploaded file object for S3
      const uploadedFile: UploadedFile = {
        id: crypto.randomUUID(),
        filename: file.name,
        originalFilename: file.name,
        fileExtension: fileExtension,
        mimeType: file.type,
        fileSize: file.size,
        storageKey,
        downloadUrl,
        createdAt: new Date().toISOString(),
      };

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileWithProgress.id
            ? {
                ...f,
                uploading: false,
                uploaded: uploadedFile,
                progress: 100,
                abortController: undefined,
              }
            : f
        )
      );

      if (onSuccess) {
        onSuccess([uploadedFile]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";

      // Only update state if it wasn't cancelled (file might be already removed)
      if (errorMessage !== "Upload cancelled") {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileWithProgress.id
              ? {
                  ...f,
                  uploading: false,
                  error: errorMessage,
                  abortController: undefined,
                }
              : f
          )
        );

        if (onError) {
          onError(error instanceof Error ? error : new Error(errorMessage));
        }
      }
    }
  };

  /**
   * Default upload flow that POSTs the file to `apiEndpoint`.
   * Includes credentials and headers, tracks progress, and supports abort.
   */
  const uploadFile = async (fileWithProgress: FileWithProgress) => {
    // Use S3 direct upload if enabled
    if (useS3) {
      return uploadFileToS3(fileWithProgress);
    }

    // Standard upload to API endpoint
    if (!apiEndpoint) {
      throw new Error("apiEndpoint is required for file upload");
    }

    const formData = new FormData();
    formData.append("file", fileWithProgress.file);
    formData.append(
      "metadata",
      JSON.stringify({ uploadedAt: new Date().toISOString() })
    );

    // Create AbortController for this upload
    const abortController = new AbortController();

    // Store AbortController with the file
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileWithProgress.id ? { ...f, abortController } : f
      )
    );

    try {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileWithProgress.id ? { ...f, progress } : f
            )
          );
        }
      });

      // Handle completion
      const uploadPromise = new Promise<UploadedFile>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response.data);
            } catch (error) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });

        // Listen to abort signal
        abortController.signal.addEventListener("abort", () => {
          xhr.abort();
        });
      });

      xhr.open("POST", apiEndpoint);

      // Include credentials (cookies) with the request
      xhr.withCredentials = true;

      // Set headers

      // Add custom headers
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }

      xhr.send(formData);

      const uploadedFile = await uploadPromise;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileWithProgress.id
            ? {
                ...f,
                uploading: false,
                uploaded: uploadedFile,
                progress: 100,
                abortController: undefined,
              }
            : f
        )
      );

      if (onSuccess) {
        onSuccess([uploadedFile]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";

      // Only update state if it wasn't cancelled (file might be already removed)
      if (errorMessage !== "Upload cancelled") {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileWithProgress.id
              ? {
                  ...f,
                  uploading: false,
                  error: errorMessage,
                  abortController: undefined,
                }
              : f
          )
        );

        if (onError) {
          onError(error instanceof Error ? error : new Error(errorMessage));
        }
      }
    }
  };

  /**
   * Handles new files from drag-and-drop or input selection.
   * In form-input mode, only validates and updates local state.
   * In upload mode, enqueues and uploads each file with progress.
   */
  const handleFiles = async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);

    // Form input mode - just update files and call onChange
    if (asFormInput) {
      // Validate files first
      const validFiles: File[] = [];
      let hasErrors = false;

      for (const file of filesArray) {
        const error = validateFile(file);
        if (error) {
          toast.error(`${file.name}: ${error}`);
          hasErrors = true;
          if (onError) {
            onError(new Error(error));
          }
          continue;
        }
        validFiles.push(file);
      }

      // Check max files limit
      if (!multiple && validFiles.length > 1) {
        const errorMsg = "Only one file is allowed";
        toast.error(errorMsg);
        if (onError) {
          onError(new Error(errorMsg));
        }
        return;
      }

      const currentFiles = isControlled
        ? value || []
        : files.map((f) => f.file);
      const newFilesList = multiple
        ? [...currentFiles, ...validFiles]
        : validFiles;

      // Check total files limit
      if (newFilesList.length > maxFiles) {
        const errorMsg = `Maximum ${maxFiles} ${maxFiles === 1 ? "file" : "files"} allowed`;
        toast.error(errorMsg);
        if (onError) {
          onError(new Error(errorMsg));
        }
        return;
      }

      // Update internal state for preview
      const newFilesWithProgress: FileWithProgress[] = validFiles.map(
        (file) => ({
          file,
          id: crypto.randomUUID(),
          progress: 100,
          uploading: false,
        })
      );

      if (!isControlled) {
        setFiles((prev) =>
          multiple ? [...prev, ...newFilesWithProgress] : newFilesWithProgress
        );
      }

      // Call onChange callback
      if (onChange) {
        onChange(newFilesList);
      }

      // Show success toast if files were added successfully and there were no errors
      if (validFiles.length > 0 && !hasErrors) {
        toast.success(
          `${validFiles.length} ${validFiles.length === 1 ? "file" : "files"} selected`
        );
      }

      return;
    }

    // Upload mode - original behavior

    // Check max files limit
    if (!multiple && filesArray.length > 1) {
      const errorMsg = "Only one file is allowed";
      toast.error(errorMsg);
      if (onError) {
        onError(new Error(errorMsg));
      }
      return;
    }

    const currentFileCount = files.filter((f) => !f.error).length;
    if (currentFileCount + filesArray.length > maxFiles) {
      const errorMsg = `Maximum ${maxFiles} ${maxFiles === 1 ? "file" : "files"} allowed`;
      toast.error(errorMsg);
      if (onError) {
        onError(new Error(errorMsg));
      }
      return;
    }

    // Validate and prepare files
    const newFiles: FileWithProgress[] = [];
    for (const file of filesArray) {
      const error = validateFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        if (onError) {
          onError(new Error(error));
        }
        continue;
      }

      newFiles.push({
        file,
        id: crypto.randomUUID(),
        progress: 0,
        uploading: true,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);

    // Upload files
    for (const fileWithProgress of newFiles) {
      await uploadFile(fileWithProgress);
    }
  };

  /**
   * Drag boundary handlers to show active state and prevent default navigation.
   */
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Drop handler to accept files.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  /**
   * File input change handler.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  /**
   * Deletes a file from local state. If upload is ongoing, aborts it.
   * When uploaded and in upload mode, requests deletion from the API.
   */
  const handleDelete = async (fileId: string) => {
    const fileToDelete = files.find((f) => f.id === fileId);

    // If file is currently uploading, abort the upload
    if (fileToDelete?.uploading && fileToDelete.abortController) {
      fileToDelete.abortController.abort();
      toast.info("Upload cancelled");
    }

    // Clean up object URL if it exists
    const objectUrl = objectUrlsRef.current.get(fileId);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrlsRef.current.delete(fileId);
    }

    // Form input mode - just update files and call onChange
    if (asFormInput) {
      const updatedFiles = files.filter((f) => f.id !== fileId);

      if (!isControlled) {
        setFiles(updatedFiles);
      }

      if (onChange) {
        onChange(updatedFiles.map((f) => f.file));
      }

      return;
    }

    // Upload mode - if still uploading (not uploaded yet), just remove from state
    if (fileToDelete?.uploading || !fileToDelete?.uploaded) {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      return;
    }

    // If file was uploaded, delete from server
    if (!apiEndpoint) {
      throw new Error("apiEndpoint is required for file deletion");
    }

    try {
      const urlWithParams = new URL(apiEndpoint);
      urlWithParams.searchParams.append(
        "storageKey",
        fileToDelete.uploaded.storageKey
      );
      const response = await fetch(urlWithParams.toString(), {
        method: "DELETE",
        credentials: "include", // Include cookies with the request
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      setFiles((prev) => prev.filter((f) => f.id !== fileId));

      if (onDelete) {
        onDelete(fileToDelete.uploaded.id);
      }
    } catch (error) {
      if (onError) {
        onError(
          error instanceof Error ? error : new Error("Failed to delete file")
        );
      }
    }
  };

  /**
   * Opens the hidden file input dialog.
   */
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Renders a preview tile/row for a given file state, honoring `compact` and `preview` modes.
   */
  const renderPreview = (fileWithProgress: FileWithProgress) => {
    const { file, progress, uploading, error, uploaded } = fileWithProgress;

    // Compact mode - preview on left, filename in middle, X on right
    if (compact) {
      let objectUrl = objectUrlsRef.current.get(fileWithProgress.id);
      if (
        !objectUrl &&
        (file.type.startsWith("image/") || file.type.startsWith("video/"))
      ) {
        objectUrl = URL.createObjectURL(file);
        objectUrlsRef.current.set(fileWithProgress.id, objectUrl);
      }

      return (
        <div
          key={fileWithProgress.id}
          className="flex items-center gap-3 p-2 border rounded-lg bg-muted/50"
        >
          {/* Preview on left */}
          <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden border bg-muted flex items-center justify-center">
            {file.type.startsWith("image/") && objectUrl ? (
              <img
                src={objectUrl}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            ) : file.type.startsWith("video/") && objectUrl ? (
              <video src={objectUrl} className="w-full h-full object-cover" />
            ) : (
              getFileIcon(file.type)
            )}
          </div>

          {/* Filename in middle */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
            {uploading && <Progress value={progress} className="mt-1 h-1" />}
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>

          {/* Delete button on right */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => handleDelete(fileWithProgress.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (preview === "list") {
      return (
        <div
          key={fileWithProgress.id}
          className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50"
        >
          <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
            {uploading && <Progress value={progress} className="mt-2 h-1" />}
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => handleDelete(fileWithProgress.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    // Get or create object URL and cache it
    let objectUrl = objectUrlsRef.current.get(fileWithProgress.id);
    if (!objectUrl) {
      objectUrl = URL.createObjectURL(file);
      objectUrlsRef.current.set(fileWithProgress.id, objectUrl);
    }

    return (
      <div
        key={fileWithProgress.id}
        className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
      >
        {file.type.startsWith("image/") ? (
          <img
            src={objectUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : file.type.startsWith("video/") ? (
          <video src={objectUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            {getFileIcon(file.type)}
            <p className="text-xs mt-2 text-center truncate w-full">
              {file.name}
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="w-full px-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <Progress value={progress} className="h-1" />
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-destructive/90 flex items-center justify-center p-2">
            <p className="text-xs text-destructive-foreground text-center">
              {error}
            </p>
          </div>
        )}

        {!uploading && !error && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
            onClick={() => handleDelete(fileWithProgress.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  // For single file uploads, show preview in place of upload area
  const showPreviewInPlace = !multiple && files.length > 0;

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={fileTypes.join(",")}
        onChange={handleChange}
        disabled={disabled}
        name={name}
      />

      {showPreviewInPlace ? (
        // Show preview in place for single file uploads
        <div className={cn(compact ? "space-y-2" : "")}>
          {files.map(renderPreview)}
        </div>
      ) : (
        <>
          {drag ? (
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 transition-colors",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25",
                disabled && "opacity-50 cursor-not-allowed",
                !disabled && "cursor-pointer hover:border-primary/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={!disabled ? onButtonClick : undefined}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {drag
                      ? "Drag & drop files here, or click to select"
                      : "Click to select files"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {multiple ? `Up to ${maxFiles} files` : "Single file"} • Max{" "}
                    {formatFileSize(sizeLimit)} each
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={onButtonClick}
              disabled={disabled}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select {multiple ? "Files" : "File"}
            </Button>
          )}

          {files.length > 0 && (
            <div
              className={cn(
                "mt-4",
                compact ? "space-y-2" : "",
                preview === "list" ? "space-y-2" : "grid gap-4",
                preview === "preview" &&
                  "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
                preview === "file" && "grid-cols-1"
              )}
            >
              {files.map(renderPreview)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
