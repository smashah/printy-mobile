import type { Device } from "react-native-ble-plx";
import { Buffer } from "node:buffer";

const DEFAULT_CHUNK_SIZE = 128;

export function chunkData(
  data: Buffer,
  chunkSize = DEFAULT_CHUNK_SIZE,
): Buffer[] {
  const chunks: Buffer[] = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.subarray(i, i + chunkSize));
  }
  return chunks;
}

export async function sendDataInChunks(
  device: Device,
  data: Buffer,
  serviceUuid: string,
  characteristicUuid: string,
) {
  const chunks = chunkData(data);
  const totalChunks = chunks.length;

  for (let i = 0; i < totalChunks; i++) {
    const chunk = chunks[i];
    const base64Data = chunk.toString("base64");

    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUuid,
        characteristicUuid,
        base64Data,
      );
    } catch (error) {
      throw new Error(`Failed to send chunk ${i + 1}/${totalChunks}: ${error}`);
    }
  }
}
