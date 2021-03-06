import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as e from "./event";
import * as airTime from "./airTime";
import * as badgeBox from "web-shared/badgeBox";
import { BadgeLink } from "web-shared/badgeLink";
import { episodeName } from "web-shared/episodeName";
import { compare } from "web-shared/romanAwareSorter";

export interface IData extends e.ITvMovie {}

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

let selectedName = b.propi("");

export const create = b.createVirtualComponent<IData>({
  render(ctx: ICtx, me: b.IBobrilNode) {
    const m = ctx.data;
    const events = m.events.filter(ev => !e.isTooFarInThePast(ev));
    const episodeNames = Array.from(new Set(events.map(e => e.name!))).sort(
      compare
    );
    const showEpisodes = !!events[0].name;
    me.children = bs.Media({}, [
      bs.MediaContent(
        { alignment: bs.MediaContentAlignment.Left },
        bs.Image({ src: m.posterUrl })
      ),
      bs.MediaContent({ alignment: bs.MediaContentAlignment.Body }, [
        badgeBox.create({
          badges: [
            ...events
              .filter(e => !showEpisodes || e.name === selectedName())
              .map(e => airTime.create(e)),
            ...m.mdbs.map(mdb =>
              BadgeLink({ link: mdb.link, text: mdb.text, color: "red" })
            )
          ]
        }),
        bs.MediaHeading2({}, [m.year > 0 ? `${m.name} (${m.year})` : m.name]),
        m.tags.map(t => bs.Badge({}, t)),
        { tag: "br" },
        showEpisodes &&
          episodeNames.map(name =>
            episodeName({
              name,
              selected: selectedName,
              allInTheFuture: events
                .filter(e => e.name === name)
                .every(e.hasNotBeenAiredYet)
            })
          ),
        showEpisodes && { tag: "br" },
        m.description
      ])
    ]);
  }
});
