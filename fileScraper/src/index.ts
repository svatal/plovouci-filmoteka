import fs from "fs";
import smb2 from "@marsaud/smb2";
import tnp from "torrent-name-parser";
import isVideo from "is-video";
import * as s from "shared/serializer";
import {
  mapAwait,
  flatMapAwait,
  filterOutFalsy,
} from "scraper-shared/src/util";
import { query, printStats } from "./csfdDataProvider";
import { IFileMovie, isSameMovie } from "shared/event";

async function main() {
  const smbClient = new smb2({
    share: "\\\\openwrt\\media",
    domain: "WORKGROUP",
    username: "",
    password: "",
    // autoCloseTimeout: 0
  }) as any;

  async function getFileNames(directory: string): Promise<string[]> {
    console.log("listing directory", directory);
    const entries: {
      name: string;
      isDirectory: () => boolean;
    }[] = await smbClient.readdir(directory, { stats: true }); // the package includes d.ts, but the real function is much richer - hence the 'as any' at smbClient
    return flatMapAwait(entries, async (e) =>
      e.isDirectory()
        ? await getFileNames(`${directory}${e.name}\\`)
        : isVideo(e.name)
        ? [`${directory}${e.name}`]
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
  return await getSingleInfo(fileName.replace(/-/g, " "), filePath);
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
