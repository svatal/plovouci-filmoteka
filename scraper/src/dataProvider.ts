import axios from "axios";
import { DiskCache } from "./cache";

const cache = new DiskCache("cache");

export function getContent(date: Date): Promise<string> {
  const dateString = getDateString(date);
  return get(dateString, getContentUrl(dateString, 0, 140));
}

function getDateString(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getContentUrl(date: string, offset: number, limit: number) {
  // https://sledovanitv.cz/epg/part-epg/2018-12-27?type=tv&offset=60&limit=20
  return `https://sledovanitv.cz/epg/part-epg/${date}?type=tv&offset=${offset}&limit=${limit}`;
}

export function getInfo(eventId: string) {
  return get(
    eventId,
    // https://sledovanitv.cz/epg/event-new?eventId=Disney_Channel%3A2018122738c079d75803eddb38a028c5e290e9ba&showActions=1
    `https://sledovanitv.cz/epg/event-new?eventId=${eventId}&showActions=1`
  );
}

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

async function get(cacheId: string, fallbackUrl: string) {
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
