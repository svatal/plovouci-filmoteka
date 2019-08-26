import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as app from "./app";
import { deserialize } from "shared/serializer";

b.asset("../../scraper-dist/events.js");
declare const es: string;
const movies = deserialize(es);

bs.init();
b.init(() => app.create({ movies: movies }));
