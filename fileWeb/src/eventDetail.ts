import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as badgeBox from "web-shared/badgeBox";
import { badgeLink } from "web-shared/badgeLink";
// import { episodeName } from "web-shared/episodeName";
// import { compare } from "web-shared/romanAwareSorter";
import { IFileMovie } from "shared/event";
import { Badge } from "bobrilstrap";

export interface IData extends IFileMovie {}

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

// let selectedName = b.propi("");

export const create = b.createVirtualComponent<IData>({
  render(ctx: ICtx, me: b.IBobrilNode) {
    const m = ctx.data;
    const files = m.files;
    // const episodeNames = Array.from(new Set(files.map(e => e.name!))).sort(
    //   compare
    // );
    // const showEpisodes = !!files[0].name;
    const showEpisodes = false;
    me.children = bs.Media({}, [
      bs.MediaContent(
        { alignment: bs.MediaContentAlignment.Left },
        bs.Image({ src: m.posterUrl })
      ),
      bs.MediaContent({ alignment: bs.MediaContentAlignment.Body }, [
        badgeBox.create({
          badges: [
            // ...files
            //   .filter(e => !showEpisodes || e.name === selectedName())
            //   .map(e => airTime.create(e)),
            ...m.mdbs.map(mdb =>
              badgeLink({ link: mdb.link, text: mdb.text, color: "red" })
            ),
            ...files.map(f =>
              Badge({ style: { backgroundColor: "brown" } }, f.path)
            )
          ]
        }),
        bs.MediaHeading2({}, [m.year > 0 ? `${m.name} (${m.year})` : m.name]),
        m.tags.map(t => bs.Badge({}, t)),
        { tag: "br" },
        // showEpisodes &&
        //   episodeNames.map(name =>
        //     episodeName({
        //       name,
        //       selected: selectedName,
        //       allInTheFuture: files
        //         .filter(e => e.name === name)
        //         .every(e.hasNotBeenAiredYet)
        //     })
        //   ),
        showEpisodes && { tag: "br" },
        m.description
      ])
    ]);
  }
});
