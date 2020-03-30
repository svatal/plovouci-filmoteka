import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as ed from "./eventDetail";
import * as sb from "./sortBy";
import * as f from "web-shared/filter";
import { IFileMovie, IExtendedEventInfo } from "shared/event";
import { isSeen } from "./seen";

const eventsOnPage = 20;

export interface IData {
  movies: IFileMovie[];
}

interface ICtx extends b.IBobrilCtx {
  data: IData;
  sortId: number;
  filter: f.IFilter<IFileMovie>[];
  displayMax: number;
}

function createUnseenFilter(): f.IFilterWithLabel<IFileMovie> {
  return { id: "neviděno", label: "neviděno", test: movie => !isSeen(movie) };
}

export const create = b.createComponent<IData>({
  init(ctx: ICtx) {
    ctx.sortId = sb.defaultValue;
    ctx.filter = [createUnseenFilter()];
    ctx.displayMax = eventsOnPage;
  },
  render(ctx: ICtx, me: b.IBobrilNode) {
    const filteredEvents = ctx.data.movies.filter(e =>
      ctx.filter.every(f => f.test(e))
    );
    const filteredTagCounts = getTagCounts(filteredEvents);
    const tagInfos = Object.getOwnPropertyNames(filteredTagCounts).map<
      f.ITagInfo
    >(n => ({
      name: n,
      selectionCount: filteredTagCounts[n]
    }));

    b.style(me, { padding: 10 });
    me.children = [
      bs.H1({}, "Filmotéka"),
      f.create({
        tags: tagInfos,
        eventCount: ctx.data.movies.length,
        selectedCount: filteredEvents.length,
        customFilters: [createUnseenFilter()],
        filter: ctx.filter,
        onChange: filter => {
          ctx.filter = filter;
          ctx.displayMax = eventsOnPage;
          b.invalidate(ctx);
        },
        getDurationsInMinutes
      }),
      sb.create({
        options: sb.options,
        selected: ctx.sortId,
        onChange: selected => {
          ctx.sortId = selected;
          ctx.displayMax = eventsOnPage;
          b.invalidate(ctx);
        }
      }),
      filteredEvents
        .sort((a, b) => sb.sort(a, b, sb.options[ctx.sortId]))
        .slice(0, ctx.displayMax)
        .map(e => ed.create({ movie: e })),
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

function getTagCounts(events: IExtendedEventInfo[]) {
  let tags: { [tag: string]: number } = {};
  events.forEach(e => {
    e.tags.forEach(t => (tags[t] = (tags[t] === undefined ? 0 : tags[t]) + 1));
  });
  return tags;
}

function getDurationsInMinutes(movie: IFileMovie) {
  return [movie.durationInMinutes];
}
