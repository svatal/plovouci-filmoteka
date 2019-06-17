import * as b from "bobril";

export interface IData {
  badges: b.IBobrilNode[];
}

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

export const create = b.createComponent<IData>({
  render(ctx: ICtx, me: b.IBobrilNode) {
    b.style(me, { cssFloat: "right" });
    me.children = ctx.data.badges.map(badge =>
      b.style(badge, { cssFloat: "right", clear: "right" })
    );
  }
});
