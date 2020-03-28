import { get, printStats } from "scraper-shared/src/dataProvider";
import { IFileMovie } from "shared/event";
import * as cheerio from "cheerio";

export { printStats };

export async function query(
  movie: {
    season?: number;
    episode?: number;
    title: string;
    year?: number;
  },
  filePath: string
): Promise<IFileMovie | undefined> {
  if (!movie.title) {
    console.log(`unable to identify ${filePath} - no title`, movie);
    return undefined;
  }
  if (movie.season !== undefined || movie.episode !== undefined) {
    console.log(
      `unable to identify ${filePath} - looks like an episode`,
      movie
    );
    return undefined; // no serials for now
  }
  const queryString = movie.year ? `${movie.title} ${movie.year}` : movie.title;
  const searchUrl = `https://csfd.cz/hledat/?q=${encodeURIComponent(
    queryString
  )}`;
  const content = await get(queryString, searchUrl);
  const [winnerUrl] = parseCandidates(content);
  let winnerContent: string;
  if (winnerUrl === undefined) {
    if (isList(content)) {
      console.log(
        `unable to identify ${filePath} - no csfd result`,
        queryString,
        movie
      );
      return undefined;
    }
    winnerContent = content;
  } else {
    const winnerId = parseCsfdId(winnerUrl);
    const absoluteWinnerUrl = `https://csfd.cz${winnerUrl}`;
    winnerContent = await get(winnerId, absoluteWinnerUrl);
  }
  return parseEventInfo(winnerContent, filePath);
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

function parseEventInfo(content: string, filePath: string): IFileMovie {
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
    posterUrl: addProtocolIfNeeded($content(".film-poster").attr("src")),
    year: +$content("span[itemprop=dateCreated]").text(),
    mdbs: [
      {
        text: `${$content("#rating h2").text()} ČSFD`,
        link: $content("link[rel=canonical]").attr("href")
      }
    ],
    tags: $content(".genre")
      .text()
      .split(" / "),
    files: [{ path: filePath }]
  };
}

function getSecondToLast<T>(a: T[]) {
  return a[a.length - 2];
}

function addProtocolIfNeeded(url: string) {
  if (url && url.startsWith("//")) return `http:${url}`;
  return url;
}
