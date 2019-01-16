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
  tags: string[];
  filter: f.IFilter[];
}

export const create = b.createComponent<IData>({
  init(ctx: ICtx) {
    ctx.sort = sb.defaultValue;
    ctx.filter = [f.createTagFilter("Komedie"), f.createTagFilter("Romantic")];

    let tags = {};
    ctx.data.events.forEach(e => {
      e.tags.forEach(t => (tags[t] = 1));
    });
    ctx.tags = Object.getOwnPropertyNames(tags);
  },
  render(ctx: ICtx, me: b.IBobrilNode) {
    const maxTime = Date.now();
    const minTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const events = ctx.data.events.filter(
      e =>
        e.startTime.getTime() < maxTime &&
        e.startTime.getTime() + e.durationInMinutes * 60 * 1000 > minTime
    );
    b.style(me, { padding: 10 });
    me.children = [
      bs.H1({}, "Plovoucí filmotéka"),
      f.create({
        allTags: ctx.tags,
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
      events
        .filter(e => ctx.filter.every(f => f.test(e)))
        .sort((a, b) => sb.sort(a, b, ctx.sort))
        .slice(0, 20)
        .map(e => ed.create(e))
    ];
  }
});
