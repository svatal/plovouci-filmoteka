import * as e from "./event";

type IRow = (string | number | string[] | string[][])[];

export function serialize(events: e.IEventInfo[]): string {
  const csv = events.map<IRow>(event => [
    event.id,
    event.name,
    event.channelName,
    event.startTime.getTime(),
    event.durationInMinutes,
    event.tags,
    event.description.split("\n"),
    event.posterUrl,
    event.mdbs.map(mdb => [mdb.text, mdb.link])
  ]);
  return JSON.stringify(csv);
}

export function deserialize(s: string): e.IEventInfo[] {
  const csv: IRow[] = JSON.parse(s);
  return csv.map((row: any[]) => {
    const ei: e.IEventInfo = {
      id: row.shift(),
      name: row.shift(),
      channelName: row.shift(),
      startTime: new Date(row.shift()),
      durationInMinutes: row.shift(),
      tags: row.shift(),
      description: row.shift().join("\n"),
      posterUrl: row.shift(),
      mdbs: row
        .shift()
        .map((mdb: string[]) => ({ text: mdb.shift(), link: mdb.shift() }))
    };
    return ei;
  });
}
