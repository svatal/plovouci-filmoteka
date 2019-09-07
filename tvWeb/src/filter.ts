import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as e from "./event";

export interface IData {
  tags: ITagInfo[];
  filter: IFilter[];
  eventCount: number;
  selectedCount: number;
  onChange: (f: IFilter[]) => void;
}

export interface ITagInfo {
  name: string;
  selectionCount: number;
}

export interface IFilter {
  id: string;
  test: (ev: e.ITvMovie) => boolean;
}

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

export const create = b.createComponent<IData>({
  render(ctx: ICtx, me: b.IBobrilNode) {
    me.children = [
      "Filtr: ",
      bs.ButtonGroup({}, [
        ...ctx.data.filter.map(f =>
          bs.Button(
            {
              title: f.id,
              onClick: () =>
                ctx.data.onChange(ctx.data.filter.filter(f2 => f2.id !== f.id))
            },
            [f.id, " ", bs.Glyphicon({ icon: bs.GlyphIcon.Trash })]
          )
        ),
        bs.ButtonGroup({}, [
          bs.Button({ title: "Přidat", variant: bs.ButtonVariant.Dropdown }, [
            bs.Glyphicon({ icon: bs.GlyphIcon.Plus })
          ]),
          bs.DropdownMenu({}, [
            ctx.data.tags
              .filter(
                tag =>
                  ctx.data.filter.map(f => f.id).indexOf(tag.name) < 0 &&
                  tag.selectionCount > 0
              )
              .map(tag =>
                bs.DropdownItem(
                  {
                    onClick: () =>
                      ctx.data.onChange([
                        ...ctx.data.filter,
                        createTagFilter(tag.name)
                      ])
                  },
                  bs.Anchor({}, `${tag.name} (${tag.selectionCount})`)
                )
              ),
            [
              createTimeFilter(0, 60),
              createTimeFilter(0, 90),
              createTimeFilter(60, 999),
              createTimeFilter(80, 999)
            ]
              .filter(f => ctx.data.filter.map(f => f.id).indexOf(f.id) < 0)
              .map(f =>
                bs.DropdownItem(
                  { onClick: () => ctx.data.onChange([...ctx.data.filter, f]) },
                  bs.Anchor({}, f.id)
                )
              )
          ])
        ])
      ]),
      ` (${ctx.data.selectedCount}/${ctx.data.eventCount})`
    ];
  }
});

export function createTagFilter(tagName: string): IFilter {
  return {
    id: tagName,
    test: e => e.tags.indexOf(tagName) >= 0
  };
}

export function createTimeFilter(from: number, to: number): IFilter {
  return {
    id: `${from}-${to} minut`,
    test: e =>
      e.events.some(
        e => e.durationInMinutes >= from && e.durationInMinutes <= to
      )
  };
}
