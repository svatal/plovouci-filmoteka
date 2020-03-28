import fs from "fs";
import smb2 from "@danielhuisman/smb2";
import tnp from "torrent-name-parser";
import isVideo from "is-video";
import * as s from "shared/serializer";
import {
  mapAwait,
  flatMapAwait,
  filterOutFalsy
} from "scraper-shared/src/util";
import { query, printStats } from "./csfdDataProvider";
import { IFileMovie, isSameMovie } from "shared/event";

async function main() {
  const smbClient = new smb2({
    share: "\\\\openwrt\\media",
    domain: "WORKGROUP",
    username: "",
    password: ""
    // autoCloseTimeout: 0
  }) as any;

  async function getFileNames(directory: string): Promise<string[]> {
    console.log("listing directory", directory);
    const entries: {
      Filename: string;
      FileAttributes: number;
    }[] = await smbClient.readdir(directory);
    return flatMapAwait(entries, async e =>
      e.FileAttributes & 16
        ? await getFileNames(`${directory}${e.Filename}\\`)
        : isVideo(e.Filename)
        ? [`${directory}${e.Filename}`]
        : []
    );
  }

  const files = await getFileNames("\\");

  const movies = deduplicate(filterOutFalsy(await mapAwait(files, getInfo)));

  const moviesString = s.serializeFileMovie(movies);

  fs.writeFileSync(
    "../fileScraper-dist/events.ts",
    `export const es: string ='${moviesString
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")}'`
  );
  printStats();

  smbClient.disconnect();
}

main();

async function getInfo(filePath: string) {
  const fileParts = filePath.split("\\");
  let fileName = fileParts.pop()!;
  if (fileName.toLocaleLowerCase().endsWith(".vob")) {
    fileName = fileParts.pop()!;
    if (fileName === "VIDEO_TS") fileName = fileParts.pop()!;
  }
  return (
    /*(await getSingleInfo(fileName, filePath)) ||*/
    await getSingleInfo(fileName.replace(/-/g, " "), filePath)
  );
}

function getSingleInfo(fileName: string, filePath: string) {
  const nameInfo = tnp(fileName);
  return query(nameInfo, filePath);
}

function deduplicate(movies: IFileMovie[]) {
  return movies.reduce((m, current) => {
    for (let i = 0; i < m.length; i++) {
      if (isSameMovie(m[i], current)) {
        m[i].files.push(...current.files);
        return m;
      }
    }
    m.push(current);
    return m;
  }, <IFileMovie[]>[]);
}
