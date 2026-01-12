// biome-ignore lint/suspicious/noBitwise: Bitmap operations require bitwise operators
import sharp from "sharp";
import { Buffer } from "node:buffer";

const PRINTER_WIDTH_DOTS = 384;
const PDF_DENSITY = 300;
const DITHER_THRESHOLD = 128;
const BITS_PER_BYTE = 8;
const BIT_MASK_OFFSET = 7;

export async function pdfToRaster(
  pdfBuffer: Buffer,
  width = PRINTER_WIDTH_DOTS,
): Promise<Buffer> {
  const imageBuffer = await sharp(pdfBuffer, { density: PDF_DENSITY })
    .resize({ width, fit: "contain" })
    .grayscale()
    .toBuffer();

  const ditheredBuffer = await sharp(imageBuffer)
    .threshold(DITHER_THRESHOLD)
    .raw()
    .toBuffer();

  return ditheredBuffer;
}

export function pixelsToBitmap(
  pixels: Buffer,
  width: number,
  height: number,
): Buffer {
  const bytesPerRow = Math.ceil(width / BITS_PER_BYTE);
  const bitmap = Buffer.alloc(bytesPerRow * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelVal = pixels[y * width + x];
      if (pixelVal < DITHER_THRESHOLD) {
        const byteIdx = y * bytesPerRow + Math.floor(x / BITS_PER_BYTE);
        const bitIdx = BIT_MASK_OFFSET - (x % BITS_PER_BYTE);
        // biome-ignore lint/suspicious/noBitwise: Bitmap operations require bitwise operators
        bitmap[byteIdx] = (bitmap[byteIdx] ?? 0) | (1 << bitIdx);
      }
    }
  }

  return bitmap;
}
