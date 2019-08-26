import * as parser from "./parser";
import * as data from "./dataProvider";
import * as eventMerger from "./eventsMerger";
import * as s from "shared/serializer";
import fs from "fs";

const showEpisodes = true;

main();

async function main() {
  let today = Date.now();
  const events: { [name: string]: parser.IBasicEventInfo[] } = {};
  let totalEvents = 0;
  for (let i = -7; i < 5; i++) {
    const day = new Date(today + i * 24 * 60 * 60 * 1000);
    const content = await data.getContent(day);
    const dayEvents = parser.parseDay(content, day);
    totalEvents += dayEvents.length;
    dayEvents.forEach(e => {
      if (!isCZProgram(e.channelName)) return;

      const serialNameMatch = e.name.match(/(.*?)( [MDCLXVI]*)? \(.*/);
      const name = serialNameMatch ? serialNameMatch[1] : e.name;
      (events[name] = events[name] || []).push(e);
    });
  }
  console.log("total events:", totalEvents);

  let movies: parser.IMovie[] = [];
  for (const name in events) {
    const eventsGroup = events[name];
    const performExactMatch =
      eventsGroup.length < 10 &&
      eventsGroup[0].name === name &&
      eventsGroup[0].durationInMinutes > 60;
    if (performExactMatch) {
      movies.push(
        ...eventMerger.merge(
          await mapAwait(eventsGroup, async e => ({
            ...e,
            ...parser.parseInfo(await data.getInfo(e.id))
          }))
        )
      );
    } else {
      if (eventsGroup[0].name === name) continue; // skip non-serials
      if (!showEpisodes) continue;
      const knownEvent = eventsGroup.find(e => data.know(e.id));
      const infoContent = knownEvent
        ? await data.getInfo(knownEvent.id)
        : await data.getInfo(
            eventsGroup.reduce(
              (c, e) => (c.startTime.getTime() > e.startTime.getTime() ? c : e),
              { id: "never get here", startTime: new Date(0) }
            ).id
          );
      movies.push(
        eventMerger.mergeToOne(eventsGroup, parser.parseInfo(infoContent), name)
      );
    }
  }
  console.log("movies:", movies.length);
  const moviesString = s.serialize(movies);

  fs.writeFileSync(
    "../scraper-dist/events.ts",
    `export const es: string ='${moviesString
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")}'`
  );
  data.printStats();
}

function isSerialName(name: string) {
  return !!name.match(/\([\d ,-]+\)( \(.*\))?$/);
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
  if (name.indexOf("Filmbox Arthouse") >= 0) return false; // only filmbox in EN
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
