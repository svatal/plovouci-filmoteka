import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as e from "./event";

export interface IData extends e.IBasicEventInfo {}

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

export const create = b.createComponent<IData>({
  render(ctx: ICtx, me: b.IBobrilNode) {
    b.style(me, { cssFloat: "right" });
    me.children = bs.Badge(
      { style: { backgroundColor: "brown" } },
      getAirTime(ctx.data)
    );
  }
});

function getAirTime(i: e.IBasicEventInfo) {
  const minutes = i.startTime.getMinutes();
  return `${i.channelName} ${i.startTime.getDate()}.${i.startTime.getMonth() +
    1}. ${i.startTime.getHours()}:${minutes < 10 ? "0" : ""}${minutes}`;
}
