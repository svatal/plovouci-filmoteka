import * as b from "bobril";
import { BadgeBox } from "web-shared/badgeBox";
import { BadgeLink } from "web-shared/badgeLink";
import { IFileMovie } from "shared/event";
import {
  Badge,
  Media,
  MediaContent,
  Image,
  MediaHeading2,
  Button,
  MediaContentAlignment
} from "bobrilstrap";
import { markAsSeen, isSeen } from "./seen";

export function EventDetail(props: { movie: IFileMovie }) {
  const m = props.movie;
  return (
    <Media>
      <MediaContent alignment={MediaContentAlignment.Left}>
        <Image src={m.posterUrl} />
      </MediaContent>
      <MediaContent alignment={MediaContentAlignment.Body}>
        <BadgeBox
          badges={[
            ...m.mdbs.map(mdb => (
              <BadgeLink link={mdb.link} text={mdb.text} color="red" />
            )),
            ...m.files.map(f => (
              <Badge style={{ backgroundColor: "brown" }}>{f.path}</Badge>
            ))
          ]}
        />
        <MediaHeading2 style={isSeen(m) ? { color: "grey" } : undefined}>
          {m.name}
          {m.year > 0 && ` (${m.year})`}{" "}
          {!isSeen(m) && (
            <Button onClick={() => markAsSeen(m)}>Označit jako viděno</Button>
          )}
        </MediaHeading2>
        {m.tags.map(t => (
          <Badge>{t}</Badge>
        ))}
        {m.durationInMinutes && (
          <Badge style={{ backgroundColor: "brown" }}>
            {m.durationInMinutes}min
          </Badge>
        )}
        <br />
        {m.description}
      </MediaContent>
    </Media>
  );
}

export const create = b.component(EventDetail);
