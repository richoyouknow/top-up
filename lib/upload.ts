import path from 'node:path';

/**
 * Resolves the absolute path for file uploads.
 * If UPLOAD_DIR is configured in environment variables, it uses it.
 * Otherwise, it falls back to the local `public/uploads` directory.
 */
export function getUploadDir(subFolder?: string): string {
  const baseDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
  return subFolder ? path.join(baseDir, subFolder) : baseDir;
}
