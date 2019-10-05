import { ITvMovie } from "shared/event";
import { ISortOption, getMDB } from "web-shared/sortBy";
import { canBeViewed } from "./event";

export { create, sort } from "web-shared/sortBy";

export const defaultValue: number = 5;

export const options: ISortOption<ITvMovie>[] = [
  { name: "Název", propertyGetter: m => m.name, sortAsc: true },
  {
    name: "Nejdříve zmizí",
    propertyGetter: m =>
      Math.max(...m.events.filter(canBeViewed).map(e => e.startTime.getTime())),
    sortAsc: true
  },
  {
    name: "Nejnověji vysílané",
    propertyGetter: m =>
      Math.min(...m.events.filter(canBeViewed).map(e => e.startTime.getTime())),
    sortAsc: false
  },
  {
    name: "Nejkratší",
    propertyGetter: m =>
      Math.min(...m.events.filter(canBeViewed).map(e => e.durationInMinutes)),
    sortAsc: true
  },
  {
    name: "Nejdelší",
    propertyGetter: m =>
      Math.min(...m.events.filter(canBeViewed).map(e => e.durationInMinutes)),
    sortAsc: false
  },
  {
    name: "Nejlépe hodnocené (TMDb)",
    propertyGetter: m => getMDB(m, "TMDb"),
    sortAsc: false
  },
  {
    name: "Nejlépe hodnocené (IMDb)",
    propertyGetter: m => getMDB(m, "IMDb"),
    sortAsc: false
  },
  { name: "Nejnovější (rok)", propertyGetter: m => m.year, sortAsc: false },
  { name: "Nejstarší (rok)", propertyGetter: m => m.year, sortAsc: true }
];
