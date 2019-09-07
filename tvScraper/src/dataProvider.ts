import { get } from "scraper-shared/src/dataProvider";
export { know, printStats } from "scraper-shared/src/dataProvider";

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
