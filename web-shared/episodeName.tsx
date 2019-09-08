import * as b from "bobril";
import { Badge } from "bobrilstrap";

export interface IData {
  selected: b.IProp<string>;
  name: string;
  allInTheFuture: boolean;
}

export const episodeName = (data: IData) => (
  <Badge
    onClick={() => {
      data.selected(data.name);
    }}
    style={{
      backgroundColor:
        data.name === data.selected()
          ? "darkred"
          : data.allInTheFuture
          ? undefined
          : "brown"
    }}
  >
    {data.name}
  </Badge>
);
