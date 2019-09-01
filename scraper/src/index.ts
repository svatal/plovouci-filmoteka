import * as parser from "./parser";
import * as data from "./dataProvider";
import * as eventMerger from "./eventsMerger";
import * as s from "shared/serializer";
import { mapAwait } from "scraper-shared/src/util";
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
      if (getProgramLang(e.channelName) !== Lang.cz) return;

      const serialNameMatch = e.name.match(/(.*?)( [MDCLXVI]*)? \(.*/);
      const name = serialNameMatch ? serialNameMatch[1] : e.name;
      (events[name] = events[name] || []).push(e);
    });
  }
  console.log("total events:", totalEvents);
  console.log("CZ events:", Object.keys(events).length);

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

enum Lang {
  noProgram,
  sport,
  music,
  hobby,
  slowTv,
  news,
  doc,
  cz,
  czRegio,
  sk,
  en,
  fr,
  de
}

const programs: [RegExp, Lang][] = [
  [/sport/i, Lang.sport],
  [/^ct24$/, Lang.news],
  [/^ct/, Lang.cz],
  [/^Seznam$/, Lang.cz],
  [/^primazoom$/, Lang.doc],
  [/^prima/, Lang.cz],
  [/^nova/, Lang.cz],
  [/^fanda$/, Lang.cz],
  [/^smichov$/, Lang.cz],
  [/^telka$/, Lang.cz],
  [/^cartoon_network/, Lang.cz],
  [/^stv/, Lang.sk],
  [/^markiza/, Lang.sk],
  [/^ta3$/, Lang.sk],
  [/^joj/, Lang.sk],
  [/^ocko/, Lang.music],
  [/^HBO/i, Lang.cz],
  [/barrandov_muzika/, Lang.music],
  [/barrandov/, Lang.cz],
  [/^axn/, Lang.cz],
  [/^travelxp$/, Lang.doc],
  [/^filmbox$/, Lang.cz],
  [/^NGC/, Lang.doc],
  [/^nat_geo/, Lang.doc],
  [/^animal_planet$/, Lang.doc],
  [/^spektrum$/, Lang.cz],
  [/^viasat/, Lang.doc],
  [/^natura/, Lang.doc],
  [/^fishinghunting$/, Lang.sport],
  [/^golf$/, Lang.sport],
  [/^Film_Europe$/, Lang.cz],
  [/^FightboxHD$/, Lang.sport],
  [/^retro$/, Lang.music],
  [/^(|.*_)(cs|cz)(|_.*)$/i, Lang.cz],
  [/^(|.*_)en(|_.*)$/i, Lang.en],
  [/^cartoon$/, Lang.en],
  [/^boomerang$/, Lang.en],
  [/^nick/i, Lang.cz],
  [/^Jim_Jam$/, Lang.cz],
  [/^Minimax$/, Lang.cz],
  [/^TVlife$/, Lang.sk],
  [/^baby_tv$/, Lang.en],
  [/^Discovery$/, Lang.doc],
  [/^TLC$/, Lang.cz],
  [/^Science$/, Lang.doc],
  [/^world$/, Lang.hobby],
  [/^ID$/, Lang.cz],
  [/^sat_crime_invest$/, Lang.cz],
  [/^history$/, Lang.cz],
  [/^cnn$/, Lang.news],
  [/^tv5$/, Lang.fr],
  [/^film_plus$/, Lang.cz],
  [/^Fastnfunbox$/, Lang.sport],
  [/^FilmboxArthouse$/, Lang.en],
  [/^Filmbox/i, Lang.cz],
  [/^360TuneBox$/, Lang.music],
  [/^DocuBoxHD$/, Lang.doc],
  [/^FashionboxHD$/, Lang.hobby],
  [/^.*BoxHD$/i, Lang.en],
  [/^kinosvet$/, Lang.cz],
  [/^cinemax/, Lang.cz],
  [/^amc$/, Lang.cz],
  [/^lounge$/, Lang.en],
  [/^Polar$/, Lang.czRegio],
  [/^slovacko$/, Lang.czRegio],
  [/^v1tv$/, Lang.czRegio],
  [/^brno1$/, Lang.czRegio],
  [/^praha$/, Lang.czRegio],
  [/^rtm_plus_liberec$/, Lang.czRegio],
  [/^regiotv$/, Lang.czRegio],
  [/^tvnoe$/, Lang.cz],
  [/^deluxe$/, Lang.music],
  [/^slagr$/, Lang.music],
  [/^orf/, Lang.de],
  [/^sky_news$/, Lang.en],
  [/^uatv$/, Lang.en],
  [/^france/, Lang.fr],
  [/^russiatoday/, Lang.news],
  [/^rt_doc$/, Lang.doc],
  [/^hobby$/, Lang.hobby],
  [/^mnamtv$/, Lang.hobby],
  [/^mnau$/, Lang.hobby],
  [/^filmpro$/, Lang.czRegio],
  [/^nasa/, Lang.hobby],
  [/^mto/, Lang.noProgram],
  [/^fireplace$/, Lang.slowTv],
  [/^uscenes/, Lang.slowTv],
  [/^night_prague$/, Lang.slowTv],
  [/^loop_naturetv/, Lang.slowTv],
  [/^stork_nest$/, Lang.slowTv]
];

function getProgramLang(name: string) {
  for (let i = 0; i < programs.length; i++) {
    const [re, lang] = programs[i];
    if (name.match(re)) return lang;
  }
  return undefined;
}
