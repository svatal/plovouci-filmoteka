import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as e from "./event";
import * as ed from "./eventDetail";
import * as sb from "./sortBy";
import * as f from "./filter";

const eventsOnPage = 20;

export interface IData {
  movies: e.IMovie[];
}

interface ICtx extends b.IBobrilCtx {
  data: IData;
  sort: sb.ISortDefinition;
  filter: f.IFilter[];
  displayMax: number;
}

export const create = b.createComponent<IData>({
  init(ctx: ICtx) {
    ctx.sort = sb.defaultValue;
    ctx.filter = [f.createTagFilter("Komedie"), f.createTagFilter("Romantic")];
    ctx.displayMax = eventsOnPage;
  },
  render(ctx: ICtx, me: b.IBobrilNode) {
    const events = ctx.data.movies.filter(m => m.events.some(e.canBeViewed));
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
          ctx.displayMax = eventsOnPage;
          b.invalidate(ctx);
        }
      }),
      sb.create({
        sort: ctx.sort,
        onChange: sort => {
          ctx.sort = sort;
          ctx.displayMax = eventsOnPage;
          b.invalidate(ctx);
        }
      }),
      filteredEvents
        .sort((a, b) => sb.sort(a, b, ctx.sort))
        .slice(0, ctx.displayMax)
        .map(e => ed.create(e)),
      filteredEvents.length > ctx.displayMax &&
        b.style(
          bs.Button(
            {
              onClick: () => {
                ctx.displayMax += eventsOnPage;
                b.invalidate(ctx);
                return true;
              }
            },
            "Další"
          ),
          bs.helpers.centerBlock
        )
    ];
  }
});

function getTagCounts(events: e.IExtendedEventInfo[]) {
  let tags: { [tag: string]: number } = {};
  events.forEach(e => {
    e.tags.forEach(t => (tags[t] = (tags[t] === undefined ? 0 : tags[t]) + 1));
  });
  return tags;
}
