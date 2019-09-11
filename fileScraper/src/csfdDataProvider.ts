import { get, printStats } from "scraper-shared/src/dataProvider";
import { IFileMovie } from "shared/event";
import * as cheerio from "cheerio";

export { printStats };

export async function query(
  movie: {
    title: string;
    year?: number;
  },
  fileName: string
): Promise<IFileMovie | undefined> {
  if (!movie.title) return undefined;
  const queryString = movie.year ? `${movie.title} ${movie.year}` : movie.title;
  const searchUrl = `https://csfd.cz/hledat/?q=${encodeURIComponent(
    queryString
  )}`;
  const content = await get(queryString, searchUrl);
  const [winnerUrl] = parseCandidates(content);
  let winnerContent: string;
  if (winnerUrl === undefined) {
    if (isList(content)) return undefined;
    winnerContent = content;
  } else {
    const winnerId = parseCsfdId(winnerUrl);
    const absoluteWinnerUrl = `https://csfd.cz${winnerUrl}`;
    winnerContent = await get(winnerId, absoluteWinnerUrl);
  }
  return parseEventInfo(winnerContent, fileName);
}

function isList(content: string) {
  return cheerio.load(content)("#search-films").length === 1;
}

function parseCandidates(content: string): string[] {
  const $content = cheerio.load(content);
  const hrefs: string[] = [];
  $content("#search-films h3.subject a.film").each((_, e) =>
    hrefs.push(e.attribs["href"])
  );
  return hrefs;
}

function parseCsfdId(url: string) {
  return url.replace(/\//g, "");
}

function parseEventInfo(content: string, fileName: string): IFileMovie {
  const $content = cheerio.load(content);
  return {
    description: $content("#plots .content div")
      .first()
      .text()
      .trim(),
    durationInMinutes: +getSecondToLast(
      $content(".origin")
        .text()
        .split(" ")
    ),
    name: $content("h1")
      .text()
      .trim(),
    posterUrl: $content(".film-poster").attr("src"),
    year: +$content("span[itemprop=dateCreated]").text(),
    mdbs: [
      {
        text: `CSFD ${$content("#rating h2").text()}`,
        link: $content("link[rel=canonical]").attr("href")
      }
    ],
    tags: $content(".genre")
      .text()
      .split(" / "),
    files: [{ path: fileName }]
  };
}

function getSecondToLast<T>(a: T[]) {
  return a[a.length - 2];
}
