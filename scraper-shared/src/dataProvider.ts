import axios from "axios";
import { DiskCache } from "./cache";

const cache = new DiskCache("cache");

export function know(cacheId: string) {
  return cache.contains(cacheId);
}

let requestCounter = 0;
let remoteRequestCounter = 0;
let waitCounter = 0;

export function printStats() {
  console.log(`Data statistics:`);
  console.log("  Data requests:", requestCounter);
  console.log("  Remote requests:", remoteRequestCounter);
  console.log("  wait triggered:", waitCounter);
}

export async function get(cacheId: string, fallbackUrl: string) {
  requestCounter++;
  if (cache.contains(cacheId)) {
    return cache.get(cacheId);
  }
  if (remoteRequestCounter++ % 20 === 19) {
    console.log(
      `Request number ${remoteRequestCounter}, waiting before processing ..`
    );
    blockingWait(1000);
    waitCounter++;
  }
  const response = await axios.get<string>(fallbackUrl);
  const data = response.data;
  cache.set(cacheId, data);
  return data;
}

function blockingWait(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
