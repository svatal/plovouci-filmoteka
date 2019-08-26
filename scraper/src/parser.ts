import * as cheerio from "cheerio";
import { IBasicEventInfo, IExtendedEventInfo, IMdbEntry } from "shared/event";
export * from "shared/event";

export function parseDay(fileContent: string, date: Date) {
  const $content = cheerio.load(`<table>${fileContent}</table>`);
  const events: IBasicEventInfo[] = [];
  $content("tr").each((i, tr) => {
    events.push(...parseChannel(tr, date));
  });
  return events;
}

function parseChannel(tr: CheerioElement, date: Date) {
  const $tr = cheerio.load(tr);
  const channelName = $tr(".schedule-channel")
    .text()
    .trim();
  const events: IBasicEventInfo[] = [];
  let skipAll = false;
  $tr(".schedule-event").each((_, event) => {
    if (skipAll) return;
    const $event = cheerio.load(event);
    const time = $event(".time")
      .text()
      .split(":")
      .map(i => parseInt(i));
    const startTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time[0],
      time[1]
    );
    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      lastEvent.durationInMinutes =
        (startTime.getTime() - lastEvent.startTime.getTime()) / 60 / 1000;
      if (lastEvent.durationInMinutes < 0) {
        lastEvent.durationInMinutes += 24 * 60;
        skipAll = true;
        return;
      }
    }
    const $eventInfo = $event(".eventInfo");
    const name = $eventInfo.text();
    const href = $eventInfo.attr("href");
    const id = href.match("eventId=(.*)&")[1];
    events.push({
      channelName,
      durationInMinutes: 0,
      id,
      name,
      startTime
    });
  });
  return events;
}

export function parseInfo(content: string): IExtendedEventInfo {
  const $content = cheerio.load(content);
  const tags: string[] = [];
  let year = 0;
  $content(".event-info .event-percentage .event-percentage-line").each(
    (_, line) => {
      const $line = cheerio.load(line);
      const text = $line("*")
        .text()
        .replace("·", "");
      if (text.trim().match(/^\d{4}$/)) {
        year = +text;
      } else {
        if (text.indexOf("\n") >= 0) {
          tags.push(...text.split("/").map(s => s.trim()));
        } else {
          //   console.log(`should be country: '${text.trim()}'`);
        }
      }
    }
  );
  const description = $content(".event-description-long").text();
  const posterUrl = $content(".event-poster-img").attr("src");
  const mdbs: IMdbEntry[] = [];
  $content(".event-info .event-mdb-link a").each((_, link) => {
    const $link = cheerio.load(link)("a");
    const text = $link.text().trim();
    const url = $link.attr("href");
    mdbs.push({
      text,
      link: url
    });
  });
  return {
    tags,
    description,
    posterUrl,
    year,
    mdbs
  };
}
