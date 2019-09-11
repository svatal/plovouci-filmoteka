import { IFileMovie } from "shared/event";
import { ISortOption, getMDB } from "web-shared/sortBy";

export { create, sort } from "web-shared/sortBy";

export const defaultValue: number = 3;

export const options: ISortOption<IFileMovie>[] = [
  { name: "Název", propertyGetter: m => m.name, sortAsc: true },
  {
    name: "Nejkratší",
    propertyGetter: m => m.durationInMinutes,
    sortAsc: true
  },
  {
    name: "Nejdelší",
    propertyGetter: m => m.durationInMinutes,
    sortAsc: false
  },
  {
    name: "Nejlépe hodnocené (ČSFD)",
    propertyGetter: m => getMDB(m, "ČSFD"),
    sortAsc: false
  },
  { name: "Nejnovější (rok)", propertyGetter: m => m.year, sortAsc: false },
  { name: "Nejstarší (rok)", propertyGetter: m => m.year, sortAsc: true }
];
