import * as e from "./event";

type IRow = (number | string | string[] | (string | number)[][])[];

export function serialize(movies: e.ITvMovie[]): string {
  const csv = movies.map<IRow>(movie => [
    movie.name,
    movie.tags,
    movie.description.split("\n"),
    movie.posterUrl,
    movie.year,
    movie.mdbs.map(mdb => [mdb.text, mdb.link]),
    movie.events.map(e => [
      e.id,
      e.channelName,
      e.startTime.getTime(),
      e.durationInMinutes,
      ...(e.name ? [e.name] : [])
    ])
  ]);
  return JSON.stringify(csv);
}

export function deserialize(s: string): e.ITvMovie[] {
  const csv: IRow[] = JSON.parse(s);
  return csv.map((row: any[]) => {
    const ei: e.ITvMovie = {
      name: row.shift(),
      tags: row.shift(),
      description: row.shift().join("\n"),
      posterUrl: row.shift(),
      year: row.shift(),
      mdbs: row
        .shift()
        .map((mdb: string[]) => ({ text: mdb.shift(), link: mdb.shift() })),
      events: row.shift().map((e: (string | number)[]) => ({
        id: e.shift(),
        channelName: e.shift(),
        startTime: new Date(e.shift()!),
        durationInMinutes: e.shift(),
        name: e.shift()
      }))
    };
    return ei;
  });
}

export function serializeFileMovie(movies: e.IFileMovie[]): string {
  const csv = movies.map<IRow>(movie => [
    movie.name,
    movie.tags,
    movie.description.split("\n"),
    movie.posterUrl,
    movie.year,
    movie.mdbs.map(mdb => [mdb.text, mdb.link]),
    movie.durationInMinutes,
    movie.files.map(e => [e.path])
  ]);
  return JSON.stringify(csv);
}

export function deserializeFileMovie(s: string): e.IFileMovie[] {
  const csv: IRow[] = JSON.parse(s);
  return csv.map((row: any[]) => {
    const ei: e.IFileMovie = {
      name: row.shift(),
      tags: row.shift(),
      description: row.shift().join("\n"),
      posterUrl: row.shift(),
      year: row.shift(),
      mdbs: row
        .shift()
        .map((mdb: string[]) => ({ text: mdb.shift(), link: mdb.shift() })),
      durationInMinutes: row.shift(),
      files: row.shift().map((e: (string | number)[]) => ({
        path: e.shift()
      }))
    };
    return ei;
  });
}
