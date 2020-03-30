import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as badgeBox from "web-shared/badgeBox";
import { badgeLink } from "web-shared/badgeLink";
import { IFileMovie } from "shared/event";
import { Badge } from "bobrilstrap";
import { markAsSeen, isSeen } from "./seen";

export interface IData extends IFileMovie {}

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

export const create = b.createVirtualComponent<IData>({
  render(ctx: ICtx, me: b.IBobrilNode) {
    const m = ctx.data;
    const files = m.files;
    me.children = bs.Media({}, [
      bs.MediaContent(
        { alignment: bs.MediaContentAlignment.Left },
        bs.Image({ src: m.posterUrl })
      ),
      bs.MediaContent({ alignment: bs.MediaContentAlignment.Body }, [
        badgeBox.create({
          badges: [
            ...m.mdbs.map(mdb =>
              badgeLink({ link: mdb.link, text: mdb.text, color: "red" })
            ),
            ...files.map(f =>
              Badge({ style: { backgroundColor: "brown" } }, f.path)
            )
          ]
        }),
        bs.MediaHeading2(
          { style: isSeen(ctx.data) ? { color: "grey" } : undefined },
          [
            m.year > 0 ? `${m.name} (${m.year})` : m.name,
            " ",
            !isSeen(ctx.data) &&
              bs.Button(
                { onClick: () => markAsSeen(ctx.data) },
                "Označit jako viděno"
              )
          ]
        ),
        m.tags.map(t => bs.Badge({}, t)),
        m.durationInMinutes &&
          bs.Badge(
            { style: { backgroundColor: "brown" } },
            `${m.durationInMinutes}min`
          ),
        { tag: "br" },
        m.description
      ])
    ]);
  }
});
