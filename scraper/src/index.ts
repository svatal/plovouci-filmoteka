import * as parser from "./parser";
import * as data from "./dataProvider";
import * as s from "../../shared/serializer";
import fs from "fs";

main();

async function main() {
  let today = Date.now();
  const events: parser.IBasicEventInfo[] = [];
  for (let i = -7; i < 5; i++) {
    const day = new Date(today + i * 24 * 60 * 60 * 1000);
    const content = await data.getContent(day);
    events.push(...parser.parseDay(content, day));
  }
  console.log("events", events.length);
  const exportEvents = await mapAwait(
    events.filter(
      e =>
        isCZProgram(e.channelName) &&
        e.durationInMinutes > 60 &&
        !isSerialName(e.name)
    ),
    async e => ({ ...e, ...parser.parseInfo(await data.getInfo(e.id)) })
  );
  const eventsString = s.serialize(exportEvents);
  fs.writeFileSync(
    "../dist/events.js",
    `var es='${eventsString.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`
  );
  data.printStats();
}

function isSerialName(name: string) {
  return !!name.match(/\([\d ,]+\)$/);
}

const czPrograms = [
  "ČT",
  "Déčko",
  "Seznam",
  "Prima",
  "Nova",
  "Óčko",
  "HBO",
  "Barrandov",
  "AXN",
  "FilmBox",
  "National Geographic",
  "Spektrum",
  "Viasat",
  // "Eurosport",
  // "Sport",
  "Film Europe",
  "Relax",
  "Rebel",
  "Retro",
  "CS Film",
  "CZ",
  "TUTY",
  "Nick",
  "Československo",
  "Jim Jam",
  "Minimax",
  "Crime",
  "History Channel",
  "Film+",
  "Filmbox",
  "Kino Svět",
  "AMC",
  "Polar",
  "TVS",
  "V1 TV",
  "TV Noe",
  "Disney Channel"
];

function isCZProgram(name: string) {
  for (let i = 0; i < czPrograms.length; i++)
    if (name.indexOf(czPrograms[i]) >= 0) return true;
  return false;
}

async function mapAwait<TIn, TOut>(
  input: TIn[],
  callback: (input: TIn) => Promise<TOut>
) {
  const output: TOut[] = [];
  for (let i = 0; i < input.length; i++) {
    output.push(await callback(input[i]));
  }
  return output;
}
