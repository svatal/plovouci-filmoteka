import fs from "fs";
import smb2 from "@danielhuisman/smb2";
import tnp from "torrent-name-parser";
import * as s from "shared/serializer";
import { mapAwait } from "scraper-shared/src/util";
import { query, printStats } from "./csfdDataProvider";

async function main() {
  // const smbClient = new smb2({
  //   share: "\\\\openwrt\\media",
  //   domain: "WORKGROUP",
  //   username: "",
  //   password: ""
  //   // autoCloseTimeout: 0
  // }) as any;

  // const result: any[] = await smbClient.readdir("cz2");
  // const files = result.map(f => f.Filename as string);
  const files = [
    "Následníci (2015 Rodinný Dobrodružný Komedie Fantasy) CZ dabing.avi",
    "Fantastická zvířata a kde je najít cz dabing novinka 2016.avi",
    "Fantastická zvířata- Grindelwaldovy zločiny (2018) CZ dabing.avi",
    "Hotel Transylvania 3 Příšerózní dovolená - ( CZ dabing 2018 ).avi",
    "Hotel Transylvánie 1 2012 Cz Dab Doporučují KINGcool Animovaný Komedie.avi",
    "Hotel-Transylvania-2-cz-dabing.avi",
    "Naslednici 2 cz Dabing.avi",
    "Vitej doma.CZ Dabing SUPER KOMEDIE!!!.avi",
    "Vykolejená 2015 CZ dabing.avi"
  ];
  const movies = await mapAwait(files, getInfo);
  console.log(movies.map(i => i && i.mdbs[0]));

  const moviesString = s.serializeFileMovie(movies);

  fs.writeFileSync(
    "../fileScraper-dist/events.ts",
    `export const es: string ='${moviesString
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")}'`
  );
  printStats();

  // smbClient.disconnect();
}

main();

async function getInfo(fileName: string) {
  return (
    (await getSingleInfo(fileName, fileName)) ||
    (await getSingleInfo(fileName.replace(/-/g, " "), fileName))
  );
}

function getSingleInfo(hintName: string, fileName: string) {
  const nameInfo = tnp(hintName);
  return query(nameInfo, fileName);
}
