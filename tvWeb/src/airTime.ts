import * as bs from "bobrilstrap";
import * as e from "./event";
import { BadgeLink } from "web-shared/badgeLink";

export interface IData extends e.ITvEvent {}

export const create = (data: IData) =>
  e.hasNotBeenAiredYet(data)
    ? bs.Badge({}, `${getAirTime(data)} (${data.durationInMinutes} min)`)
    : BadgeLink({
        link: `http://sledovanitv.cz/home#event%3A${data.id}`,
        color: "brown",
        text: `${getAirTime(data)} (${data.durationInMinutes} min)`
      });

function getAirTime(i: e.ITvEvent) {
  const minutes = i.startTime.getMinutes();
  return `${i.channelName} ${i.startTime.getDate()}.${i.startTime.getMonth() +
    1}. ${i.startTime.getHours()}:${minutes < 10 ? "0" : ""}${minutes}`;
}
