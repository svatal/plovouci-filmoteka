import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as e from "./event";

export enum SortBy {
  airTime,
  name,
  duration,
  csfd,
  imdb,
  year
}

export interface IData {
  sort: ISortDefinition;
  onChange(sort: ISortDefinition): void;
}

interface ICtx extends b.IBobrilCtx {
  data: IData;
}

export interface ISortDefinition {
  sortBy: SortBy;
  sortAsc: boolean;
}

interface ISortOption extends ISortDefinition {
  name: string;
}

const options: ISortOption[] = [
  { name: "Název", sortBy: SortBy.name, sortAsc: true },
  { name: "Nejdříve zmizí", sortBy: SortBy.airTime, sortAsc: true },
  { name: "Nejnověji vysílané", sortBy: SortBy.airTime, sortAsc: false },
  { name: "Nejkratší", sortBy: SortBy.duration, sortAsc: true },
  { name: "Nejdelší", sortBy: SortBy.duration, sortAsc: false },
  { name: "Nejlépe hodnocené (ČSFD)", sortBy: SortBy.csfd, sortAsc: false },
  { name: "Nejlépe hodnocené (IMDb)", sortBy: SortBy.imdb, sortAsc: false },
  { name: "Nejnovější (rok)", sortBy: SortBy.year, sortAsc: false },
  { name: "Nejstarší (rok)", sortBy: SortBy.year, sortAsc: true }
];

export const defaultValue: ISortDefinition = options[5];

export const create = b.createComponent<IData>({
  render(ctx: ICtx, me: b.IBobrilNode) {
    const selected = options.find(
      o =>
        o.sortAsc === ctx.data.sort.sortAsc && o.sortBy === ctx.data.sort.sortBy
    )!;
    me.children = [
      "Setřídít dle: ",
      bs.Dropdown(
        { button: { label: selected.name }, buttonGroup: true },
        bs.DropdownMenu({}, [
          options.map(o =>
            bs.DropdownItem(
              { onClick: () => ctx.data.onChange(o) },
              bs.Anchor({}, o.name)
            )
          )
        ])
      )
    ];
  }
});

export function sort(
  a: e.ITvMovie,
  b: e.ITvMovie,
  { sortBy, sortAsc }: ISortDefinition
): number {
  const getter = sortPropertyGetter(sortBy, sortAsc);
  const aVal = getter(a);
  const bVal = getter(b);
  const ascModifier = sortAsc ? 1 : -1;
  if (aVal === undefined && bVal === undefined)
    return sortBy === SortBy.name
      ? 0
      : sort(a, b, { sortBy: SortBy.name, sortAsc: true });
  if (aVal === undefined) return 1;
  if (bVal === undefined) return -1;
  if (aVal < bVal) return -1 * ascModifier;
  if (aVal > bVal) return 1 * ascModifier;
  return sortBy === SortBy.name
    ? 0
    : sort(a, b, { sortBy: SortBy.name, sortAsc: true });
}

function sortPropertyGetter(
  sortBy: SortBy,
  sortAsc: boolean
): (m: e.ITvMovie) => string | number | undefined {
  switch (sortBy) {
    case SortBy.name:
      return m => m.name;
    case SortBy.duration:
      return m =>
        Math.min(
          ...m.events.filter(e.canBeViewed).map(e => e.durationInMinutes)
        );
    case SortBy.airTime:
      return m =>
        sortAsc
          ? Math.max(
              ...m.events.filter(e.canBeViewed).map(e => e.startTime.getTime())
            )
          : Math.min(
              ...m.events.filter(e.canBeViewed).map(e => e.startTime.getTime())
            );
    case SortBy.csfd:
      return m => getMDB(m, "ČSFD");
    case SortBy.imdb:
      return m => getMDB(m, "IMDb");
    case SortBy.year:
      return m => m.year;
    default:
      return m => m.name;
  }
}

function getMDB(e: e.IExtendedEventInfo, mdbName: string): number | undefined {
  const mdb = e.mdbs.find(mdb => mdb.text.indexOf(mdbName) >= 0);
  if (!mdb) return undefined;
  return parseInt(mdb.text);
}
