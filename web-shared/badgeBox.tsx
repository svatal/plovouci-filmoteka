import * as b from "bobril";

export function BadgeBox(props: { badges: b.IBobrilNode[] }) {
  return (
    <div style={{ cssFloat: "right" }}>
      {props.badges.map(badge => (
        <div style={{ cssFloat: "right", clear: "right" }}>{badge}</div>
      ))}
    </div>
  );
}

export const create = b.component(BadgeBox);
