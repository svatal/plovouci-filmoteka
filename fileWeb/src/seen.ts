import * as b from "bobril";
import * as p from "./persist";
import { IFileMovie } from "shared/event";

async function load() {
  const response = await p.load<ISeen>("seen_movies");
  seen = response || {};
  b.invalidate();
}

function send() {
  p.send("seen_movies", seen);
}

load();

type ISeen = { [csfdUrl: string]: true };

let seen: ISeen = {};

export function isSeen(movie: IFileMovie): boolean {
  const csfdUrl = movie.mdbs[0].link;
  return seen[csfdUrl] || false;
}

export function markAsSeen(movie: IFileMovie) {
  const csfdUrl = movie.mdbs[0].link;
  seen[csfdUrl] = true;
  b.invalidate();
  send();
}
