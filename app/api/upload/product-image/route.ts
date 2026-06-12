import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getUploadDir } from '@/lib/upload';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'File tidak ditemukan.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Format file harus JPG, PNG, atau WEBP.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Ukuran file maksimal 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `${Date.now()}-${randomUUID()}.${extension}`;

    const uploadDir = getUploadDir('products');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return relative path so images work in both dev and production
    const publicUrl = `/uploads/products/${fileName}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Upload product image failed:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal upload gambar.' },
      { status: 500 }
    );
  }
}
