import * as b from "bobril";
import * as bs from "bobrilstrap";
import { IMovie } from "shared/event";

export interface IData<TMovie extends IMovie> {
  options: ISortOption<TMovie>[];
  selected: number;
  onChange(selected: number): void;
}

export interface ISortDefinition<TMovie extends IMovie> {
  propertyGetter: (m: TMovie) => string | number | undefined;
  sortAsc: boolean;
}

export interface ISortOption<TMovie extends IMovie>
  extends ISortDefinition<TMovie> {
  name: string;
}

export const create = b.component(
  <TMovie extends IMovie>(data: IData<TMovie>) => {
    const selected = data.options[data.selected];
    return [
      "Setřídít dle: ",
      bs.Dropdown(
        { button: { label: selected.name }, buttonGroup: true },
        bs.DropdownMenu({}, [
          data.options.map((o, i) =>
            bs.DropdownItem(
              { onClick: () => data.onChange(i) },
              bs.Anchor({}, o.name)
            )
          )
        ])
      )
    ];
  }
) as <TMovie extends IMovie>(
  data: IData<TMovie>
) => b.IBobrilNode<IData<TMovie>>;

const sortByName: ISortDefinition<IMovie> = {
  propertyGetter: m => m.name,
  sortAsc: true
};

export function sort<TMovie extends IMovie>(
  a: TMovie,
  b: TMovie,
  sd: ISortDefinition<TMovie>
): number {
  const aVal = sd.propertyGetter(a);
  const bVal = sd.propertyGetter(b);
  const ascModifier = sd.sortAsc ? 1 : -1;
  if (aVal === undefined && bVal === undefined)
    return sd === sortByName ? 0 : sort(a, b, sortByName);
  if (aVal === undefined) return 1;
  if (bVal === undefined) return -1;
  if (aVal < bVal) return -1 * ascModifier;
  if (aVal > bVal) return 1 * ascModifier;
  return sortByName ? 0 : sort(a, b, sortByName);
}

export function getMDB(e: IMovie, mdbName: string): number | undefined {
  const mdb = e.mdbs.find(mdb => mdb.text.indexOf(mdbName) >= 0);
  if (!mdb) return undefined;
  return parseInt(mdb.text);
}
