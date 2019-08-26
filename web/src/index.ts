import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as app from "./app";
import { deserialize } from "shared/serializer";
import { es } from "scraper-dist/events";

const movies = deserialize(es);

bs.init();
b.init(() => app.create({ movies: movies }));
