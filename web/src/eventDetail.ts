import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as e from "./event";
import * as airTime from "./airTime";

export interface IData extends e.IEventInfo {}

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

export const create = b.createVirtualComponent<IData>({
  render(ctx: ICtx, me: b.IBobrilNode) {
    const e = ctx.data;
    me.children = bs.Media({}, [
      bs.MediaContent(
        { alignment: bs.MediaContentAlignment.Left },
        bs.Image({ src: e.posterUrl })
      ),
      bs.MediaContent({ alignment: bs.MediaContentAlignment.Body }, [
        bs.MediaHeading2({}, [
          `${e.name} (${e.durationInMinutes} min)`,
          airTime.create(e)
        ]),
        e.tags.map(t => bs.Badge({}, t)),
        e.mdbs.map(mdb =>
          bs.Badge(
            { style: { backgroundColor: "red", cssFloat: "right" } },
            mdb.text
          )
        ),
        { tag: "br" },
        e.description
      ])
    ]);
  }
});
