/**
 * Utility functions for file operations
 */

import { FILE_UPLOAD, MESSAGES } from "@/lib/constants";

/**
 * Validate file type
 */
export function isValidFileType(fileName: string): boolean {
  const extension = ("." + fileName.split(".").pop()?.toLowerCase()) as
    | ".pdf"
    | ".docx"
    | ".txt";
  return FILE_UPLOAD.ACCEPTED_TYPES.includes(extension);
}

/**
 * Validate file size
 */
export function isValidFileSize(fileSize: number): boolean {
  return fileSize <= FILE_UPLOAD.MAX_SIZE_BYTES;
}

/**
 * Get file extension
 */
export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

/**
 * Validate file with error message
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!isValidFileType(file.name)) {
    return { valid: false, error: MESSAGES.INVALID_FILE_TYPE };
  }

  if (!isValidFileSize(file.size)) {
    return { valid: false, error: MESSAGES.FILE_TOO_LARGE };
  }

  return { valid: true };
}

/**
 * Read file as text
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
