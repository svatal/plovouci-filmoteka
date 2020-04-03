import * as b from "bobril";
import * as p from "./persist";
import { IFileMovie } from "shared/event";

async function load() {
  const response = await p.load<IChecked>("checked_movies");
  checked = response || {};
  b.invalidate();
}

function send() {
  p.send("checked_movies", checked);
}

load();

type IChecked = { [csfdUrl: string]: true };

let checked: IChecked = {};

export function isChecked(movie: IFileMovie): boolean {
  const csfdUrl = movie.mdbs[0].link;
  return checked[csfdUrl] || false;
}

export function markAsChecked(movie: IFileMovie) {
  const csfdUrl = movie.mdbs[0].link;
  checked[csfdUrl] = true;
  b.invalidate();
  send();
}
