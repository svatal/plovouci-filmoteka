import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as e from "./event";
import * as ed from "./eventDetail";
import * as sb from "./sortBy";
import * as f from "./filter";

export interface IData {
  events: e.IEventInfo[];
}

interface ICtx extends b.IBobrilCtx {
  data: IData;
  sort: sb.ISortDefinition;
  filter: f.IFilter[];
}

export const create = b.createComponent<IData>({
  init(ctx: ICtx) {
    ctx.sort = sb.defaultValue;
    ctx.filter = [f.createTagFilter("Komedie"), f.createTagFilter("Romantic")];
  },
  render(ctx: ICtx, me: b.IBobrilNode) {
    const maxTime = Date.now();
    const minTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const events = ctx.data.events.filter(
      e =>
        e.startTime.getTime() < maxTime &&
        e.startTime.getTime() + e.durationInMinutes * 60 * 1000 > minTime
    );
    const filteredEvents = events.filter(e => ctx.filter.every(f => f.test(e)));
    const filteredTagCounts = getTagCounts(filteredEvents);
    const tagInfos = Object.getOwnPropertyNames(filteredTagCounts).map<
      f.ITagInfo
    >(n => ({
      name: n,
      selectionCount: filteredTagCounts[n]
    }));

    b.style(me, { padding: 10 });
    me.children = [
      bs.H1({}, "Plovoucí filmotéka"),
      f.create({
        tags: tagInfos,
        eventCount: events.length,
        selectedCount: filteredEvents.length,
        filter: ctx.filter,
        onChange: filter => {
          ctx.filter = filter;
          b.invalidate(ctx);
        }
      }),
      sb.create({
        sort: ctx.sort,
        onChange: sort => {
          ctx.sort = sort;
          b.invalidate(ctx);
        }
      }),
      filteredEvents
        .sort((a, b) => sb.sort(a, b, ctx.sort))
        .slice(0, 20)
        .map(e => ed.create(e))
    ];
  }
});

function getTagCounts(events: e.IEventInfo[]) {
  let tags: { [tag: string]: number } = {};
  events.forEach(e => {
    e.tags.forEach(t => (tags[t] = (tags[t] === undefined ? 0 : tags[t]) + 1));
  });
  return tags;
}
