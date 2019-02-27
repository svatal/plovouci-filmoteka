import * as bs from "bobrilstrap";
import * as e from "./event";

export interface IData extends e.IEvent {}

export const create = (data: IData) =>
  bs.Badge(
    {
      style: {
        backgroundColor: e.hasNotBeenAiredYet(data) ? undefined : "brown"
      }
    },
    `${getAirTime(data)} (${data.durationInMinutes} min)`
  );

function getAirTime(i: e.IEvent) {
  const minutes = i.startTime.getMinutes();
  return `${i.channelName} ${i.startTime.getDate()}.${i.startTime.getMonth() +
    1}. ${i.startTime.getHours()}:${minutes < 10 ? "0" : ""}${minutes}`;
}
