import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as app from "./app";
import { deserializeFileMovie } from "shared/serializer";
import { es } from "file-scraper-dist/events";

const movies = deserializeFileMovie(es);

bs.init();
b.init(() => app.create({ movies: movies }));
