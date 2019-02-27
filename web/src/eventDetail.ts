import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as e from "./event";
import * as airTime from "./airTime";
import * as badgeBox from "./badgeBox";

export interface IData extends e.IMovie {}

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

export const create = b.createVirtualComponent<IData>({
  render(ctx: ICtx, me: b.IBobrilNode) {
    const m = ctx.data;
    me.children = bs.Media({}, [
      bs.MediaContent(
        { alignment: bs.MediaContentAlignment.Left },
        bs.Image({ src: m.posterUrl })
      ),
      bs.MediaContent({ alignment: bs.MediaContentAlignment.Body }, [
        badgeBox.create({
          badges: [
            ...m.events
              .filter(ev => !e.isTooFarInThePast(ev))
              .map(e => airTime.create(e)),
            ...m.mdbs.map(mdb =>
              bs.Badge({ style: { backgroundColor: "red" } }, mdb.text)
            )
          ]
        }),
        bs.MediaHeading2({}, [m.name]),
        m.tags.map(t => bs.Badge({}, t)),
        { tag: "br" },
        m.description
      ])
    ]);
  }
});
