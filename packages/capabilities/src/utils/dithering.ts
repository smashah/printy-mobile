import sharp from "sharp";

interface DitherInput {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

function floydSteinbergDither(input: DitherInput): DitherInput {
  const { width, height, data } = input;
  const output = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        const oldPixel = output[idx + c] ?? 0;
        const newPixel = oldPixel < 128 ? 0 : 255;
        output[idx + c] = newPixel;
        const quantError = oldPixel - newPixel;

        if (x + 1 < width) {
          output[idx + 4 + c] = Math.min(
            255,
            Math.max(0, (output[idx + 4 + c] ?? 0) + (quantError * 7) / 16),
          );
        }
        if (y + 1 < height) {
          if (x > 0) {
            output[idx + width * 4 - 4 + c] = Math.min(
              255,
              Math.max(
                0,
                (output[idx + width * 4 - 4 + c] ?? 0) + (quantError * 3) / 16,
              ),
            );
          }
          output[idx + width * 4 + c] = Math.min(
            255,
            Math.max(
              0,
              (output[idx + width * 4 + c] ?? 0) + (quantError * 5) / 16,
            ),
          );
          if (x + 1 < width) {
            output[idx + width * 4 + 4 + c] = Math.min(
              255,
              Math.max(
                0,
                (output[idx + width * 4 + 4 + c] ?? 0) + (quantError * 1) / 16,
              ),
            );
          }
        }
      }
    }
  }

  return { width, height, data: output };
}

export async function ditherImage(
  imageUrl: string,
  width: number,
  height: number,
): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const { data, info } = await sharp(inputBuffer)
      .resize(width, height)
      .modulate({ brightness: 1.2 })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const dithered = floydSteinbergDither({
      width: info.width,
      height: info.height,
      data: new Uint8ClampedArray(data),
    });

    const outputBuffer = await sharp(Buffer.from(dithered.data), {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toBuffer();

    return `data:image/png;base64,${outputBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error dithering image:", error);
    return imageUrl;
  }
}

export async function createDitheredBackground(
  hexColor: string,
  width = 32,
  height = 32,
): Promise<string> {
  try {
    const { data, info } = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: hexColor,
      },
    })
      .linear(0.3, 178)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const dithered = floydSteinbergDither({
      width: info.width,
      height: info.height,
      data: new Uint8ClampedArray(data),
    });

    const outputBuffer = await sharp(Buffer.from(dithered.data), {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toBuffer();

    return `data:image/png;base64,${outputBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error creating dithered background:", error);
    return "";
  }
}
