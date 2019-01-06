import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as e from "./event";
import * as ed from "./eventDetail";
import * as sb from "./sortBy";

export interface IData {
  events: e.IEventInfo[];
}

interface ICtx extends b.IBobrilCtx {
  data: IData;
  sort: sb.ISortDefinition;
}

export const create = b.createComponent<IData>({
  init(ctx: ICtx) {
    ctx.sort = sb.defaultValue;
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
      bs.H1({}, "Romantické komedie"),
      "Setřídít dle:",
      sb.create({
        sort: ctx.sort,
        onChange: sort => {
          ctx.sort = sort;
          b.invalidate(ctx);
        }
      }),
      events
        .filter(
          e => e.tags.indexOf("Komedie") >= 0 && e.tags.indexOf("Romantic") >= 0
        )
        .sort((a, b) => sb.sort(a, b, ctx.sort))
        .map(e => ed.create(e))
    ];
  }
});
