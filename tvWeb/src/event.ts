import * as e from "shared/event";
export * from "shared/event";

export function isTooFarInThePast(ev: e.ITvEvent) {
  const minTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return ev.startTime.getTime() + ev.durationInMinutes * 60 * 1000 <= minTime;
}

export function hasNotBeenAiredYet(ev: e.ITvEvent) {
  const maxTime = Date.now();
  return ev.startTime.getTime() > maxTime;
}

export function canBeViewed(ev: e.ITvEvent) {
  return !isTooFarInThePast(ev) && !hasNotBeenAiredYet(ev);
}
