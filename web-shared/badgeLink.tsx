import * as b from "bobril";
import { Anchor, Target, Badge } from "bobrilstrap";

export interface IData {
  link: string;
  color: string;
  text: string;
}

export const BadgeLink = (data: IData) => (
  <Anchor href={data.link} target={Target.Blank}>
    <Badge style={{ backgroundColor: data.color }}>{data.text}</Badge>
  </Anchor>
);
