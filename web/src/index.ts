import * as b from "bobril";
import * as bs from "bobrilstrap";
import * as app from "./app";
import { deserialize } from "../../shared/serializer";

b.asset("../../dist/events.js");
declare const es: string;
const events = deserialize(es);

bs.init();
b.init(() => app.create({ events }));
