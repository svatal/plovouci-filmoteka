import * as e from "./event";

type IRow = (string | string[] | (string | number)[][])[];

export function serialize(movies: e.IMovie[]): string {
  const csv = movies.map<IRow>(movie => [
    movie.name,
    movie.tags,
    movie.description.split("\n"),
    movie.posterUrl,
    movie.mdbs.map(mdb => [mdb.text, mdb.link]),
    movie.events.map(e => [
      e.id,
      e.channelName,
      e.startTime.getTime(),
      e.durationInMinutes
    ])
  ]);
  return JSON.stringify(csv);
}

export function deserialize(s: string): e.IMovie[] {
  const csv: IRow[] = JSON.parse(s);
  return csv.map((row: any[]) => {
    const ei: e.IMovie = {
      name: row.shift(),
      tags: row.shift(),
      description: row.shift().join("\n"),
      posterUrl: row.shift(),
      mdbs: row
        .shift()
        .map((mdb: string[]) => ({ text: mdb.shift(), link: mdb.shift() })),
      events: row.shift().map((e: (string | number)[]) => ({
        id: e.shift(),
        channelName: e.shift(),
        startTime: new Date(e.shift()),
        durationInMinutes: e.shift()
      }))
    };
    return ei;
  });
}
